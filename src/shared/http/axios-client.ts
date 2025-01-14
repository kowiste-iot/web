import axios from 'axios'

import { AxiosError } from 'axios'
import { EHttpStatus } from '@/features/shared/domain/EHttpStatus'
import type { InternalAxiosRequestConfig } from 'axios'
import { useRequest } from '@/plugins/request/store'
import { useAuthStore } from '@/plugins/security/store'
import router from '@/router'
const axiosServices = axios.create({
  timeout: import.meta.env.VITE_API_TIMEOUT,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosServices.interceptors.request.use(
  async (config) => {
    console.log('inter')

    const token = useAuthStore().token
    console.log('inter tok', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    //useLoading().setRequest(true)
    //console.log('request id', requestID)
    config.cancelToken = useRequest().create(getRequestID(config))
    // config.headers.Authorization = `Bearer ${useKeycloakStore().token}`
    return config
  },
  (error: Error) => Promise.reject(error)
)

// interceptor for http response
axiosServices.interceptors.response.use(
  (response) => {
    //useLoading().setRequest(false)
    useRequest().delete(getRequestID(response.config))
    if (response.status == 401 || response.status == 403) {
      console.log('not auth')

      useAuthStore().logout()
      router.push('/')
    }
    return response.data
  },
  (error: AxiosError) => {
    //useLoading().setRequest(false)
    console.log('error response')

    if (error.config) useRequest().delete(getRequestID(error.config))
    return Promise.reject(error)
  }
)

export function getRequestID(config: InternalAxiosRequestConfig<any>): string {
  return `${config.method}-${config.url}`
}

export default axiosServices
