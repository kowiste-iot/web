// other imports
import axios, { AxiosError } from 'axios'
import { EHttpStatus } from '@/enums/EHttpStatus'
const axiosServices = axios.create({ timeout: 1500000 })

axiosServices.interceptors.request.use(
  async (config) => {
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
    return response.data
  },
  (error: AxiosError) => {
    if (
      error.response?.status == EHttpStatus.UnAuthorize //&&
      //useKeycloakStore().token
    ) {
     // useNavigation().setAuthorize(false)
    }
    //useLoading().setRequest(false)
    if (error.config) useRequest().delete(getRequestID(error.config))
    return Promise.reject(error)
  }
)
import type { InternalAxiosRequestConfig } from 'axios'
import { useRequest } from '@/plugins/request/store'

export function getRequestID(
  config: InternalAxiosRequestConfig<any>
): string {
  return `${config.method}-${config.url}`
}

export default axiosServices
