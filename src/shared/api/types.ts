export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}
import type { AxiosError } from 'axios'

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  status: number
}
