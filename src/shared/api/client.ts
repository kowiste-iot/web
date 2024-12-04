// src/infrastructure/api/client.ts
import axios, { type AxiosInstance,type  AxiosRequestConfig } from 'axios'
import { API_CONFIG } from './config'

export class ApiClient {
  private readonly axiosInstance: AxiosInstance // renamed from instance to axiosInstance

  constructor(config: AxiosRequestConfig = API_CONFIG) {
    this.axiosInstance = axios.create(config)
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  get instance(): AxiosInstance {
    return this.axiosInstance
  }
}
