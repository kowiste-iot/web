// axios-client.ts
import axios from 'axios'
import { AxiosError, type AxiosInstance } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useRequest } from '@/plugins/request/store'
import { getRouter } from '@/router'
import { Environment } from '@/utils/enviroment/enviroment'
import { useSessionStore } from '@/features/session/store/useSessionStore'
import { useTenant } from '@/composable/useTenant'
import { keycloakService } from '@/plugins/security/KeycloakService'
import logger from '../log/logger'

let axiosInstance: AxiosInstance
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

// Function to add failed requests to the retry queue
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// Function to retry all queued requests
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// Function to reject all queued requests
const onRefreshFailed = (error: any) => {
  refreshSubscribers.forEach((callback) => callback(''))
  refreshSubscribers = []

  // Redirect to login if token refresh fails
  getRouter().push({ name: 'error', query: { reason: 'session_expired' } })
  return Promise.reject(error)
}

export const createAxiosClient = () => {
  const env = Environment.getInstance()

  axiosInstance = axios.create({
    timeout: env.APITimeOut,
    baseURL: env.APIURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  axiosInstance.interceptors.request.use(
    async (config) => {
      // Get current token
      let token = keycloakService.token

      // If token is missing but user should be authenticated, try to refresh
      if (
        !token &&
        keycloakService.isInitialized &&
        keycloakService.isAuthenticated.value
      ) {
        try {
          // Try to refresh the token
          const refreshed = await keycloakService.updateToken(60)
          if (refreshed) {
            token = keycloakService.token
          }
        } catch (error) {
          logger.error('Failed to refresh token before request:', error)
        }
      }

      // Set the token if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request tracking and tenant info
      const { getTenantId } = useTenant()
      config.cancelToken = useRequest().create(getRequestID(config))
      config.headers['X-Branch-ID'] = useSessionStore().getCurrentBranch
      config.headers['X-Tenant-ID'] = getTenantId()

      return config
    },
    (error: Error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      useRequest().delete(getRequestID(response.config))
      return response.data
    },
    async (error: AxiosError) => {
      if (error.config) useRequest().delete(getRequestID(error.config))

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        const originalRequest = error.config as any

        // Prevent infinite loops
        if (!originalRequest._retry) {
          originalRequest._retry = true

          // If not already refreshing, attempt to refresh the token
          if (!isRefreshing) {
            isRefreshing = true

            try {
              // Try to refresh the token
              const refreshed = await keycloakService.updateToken(60)

              if (refreshed) {
                const newToken = keycloakService.token
                if (newToken) {
                  // Update the Authorization header
                  axios.defaults.headers.common[
                    'Authorization'
                  ] = `Bearer ${newToken}`
                  originalRequest.headers.Authorization = `Bearer ${newToken}`

                  // Notify subscribers and reset refreshing state
                  onTokenRefreshed(newToken)
                  isRefreshing = false

                  // Retry the original request
                  return axiosInstance(originalRequest)
                }
              }

              // If refresh failed, logout
              isRefreshing = false
              await keycloakService.logout()
              return onRefreshFailed(error)
            } catch (refreshError) {
              isRefreshing = false
              await keycloakService.logout()
              return onRefreshFailed(refreshError)
            }
          } else {
            // Wait for token refresh
            return new Promise((resolve, reject) => {
              subscribeTokenRefresh((token: string) => {
                if (token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                  resolve(axiosInstance(originalRequest))
                } else {
                  reject(error)
                }
              })
            })
          }
        } else {
          // Already tried refreshing, redirect to login
          await keycloakService.logout()
          getRouter().push('/')
        }
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}

export const axiosClient = () => {
  if (!axiosInstance || axiosInstance == null) {
    createAxiosClient()
  }
  return axiosInstance
}

export function getRequestID(config: InternalAxiosRequestConfig<any>): string {
  return `${config.method}-${config.url}`
}

export default axiosClient
