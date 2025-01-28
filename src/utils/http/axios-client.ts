// axios-client.ts
import axios from 'axios'
import { AxiosError, type AxiosInstance } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useRequest } from '@/plugins/request/store'
import { useAuthStore } from '@/plugins/security/store'
import { getRouter } from '@/router'
import { Environment } from '@/utils/enviroment/enviroment'

let axiosInstance: AxiosInstance | null = null

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
      const token = useAuthStore().token
      if (token) {
        //console.log('token axios', token.slice(-5))
        config.headers.Authorization = `Bearer ${token}`
      }
      config.cancelToken = useRequest().create(getRequestID(config))
      return config
    },
    (error: Error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      useRequest().delete(getRequestID(response.config))
      if (response.status == 401 || response.status == 403) {
        console.log('not auth')
        useAuthStore().logout()
        getRouter().push('/')
      }
      return response.data
    },
    (error: AxiosError) => {
      console.log('error response')
      if (error.config) useRequest().delete(getRequestID(error.config))
      return Promise.reject(error)
    }
  )

  return axiosInstance
}

export const axiosClient = () => {
  if (!axiosInstance) {
    throw new Error(
      'Axios client not initialized. Call createAxiosClient first'
    )
  }
  return axiosInstance
}

export function getRequestID(config: InternalAxiosRequestConfig<any>): string {
  return `${config.method}-${config.url}`
}

export default axiosClient
