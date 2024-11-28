import type { AxiosError } from 'axios'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { User } from '@/domain/models/User'
import type { UserDTO } from '../api/dto/UserDTO'
import type { ApiResponse, ApiError } from '../api/types'
import { UserMapper } from '@/infra/mappers/UserMappers'
import { ApiClient } from '../api/client'
import type { CreateUserParams } from '@/domain/models/type'

export class UserRepository implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findAll(): Promise<User[]> {
    try {
      const response = await this.apiClient.instance.get<
        ApiResponse<UserDTO[]>
      >('/users')
      return response.data.data.map(UserMapper.toDomain)
    } catch (error) {
      this.handleError(error)
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const response = await this.apiClient.instance.get<ApiResponse<UserDTO>>(
        `/users/${id}`
      )
      return UserMapper.toDomain(response.data.data)
    } catch (error) {
      if (this.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      this.handleError(error)
    }
  }

  async create(params: CreateUserParams ): Promise<User> {
    try {
      const dto: Omit<UserDTO, 'id' | 'created_at'> = {
        full_name: params.name,
        email: params.email,
        is_active: params.isActive,
        role: params.role,
      }

      const response = await this.apiClient.instance.post<ApiResponse<UserDTO>>(
        '/users',
        dto
      )
      return UserMapper.toDomain(response.data.data)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    try {
      const dto: Partial<UserDTO> = {}
      if (userData.name !== undefined) dto.full_name = userData.name
      if (userData.email !== undefined) dto.email = userData.email
      if (userData.isActive !== undefined) dto.is_active = userData.isActive
      if (userData.role !== undefined) dto.role = userData.role

      const response = await this.apiClient.instance.patch<
        ApiResponse<UserDTO>
      >(`/users/${id}`, dto)
      return UserMapper.toDomain(response.data.data)
    } catch (error) {
      this.handleError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.instance.delete(`/users/${id}`)
    } catch (error) {
      this.handleError(error)
    }
  }

  private isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError === true
  }

  private handleError(error: unknown): never {
    if (this.isAxiosError(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message

      switch (status) {
        case 400:
          throw new Error(`Bad request: ${message}`)
        case 401:
          throw new Error('Unauthorized access')
        case 403:
          throw new Error('Forbidden access')
        case 404:
          throw new Error('Resource not found')
        case 422:
          throw new Error(`Validation error: ${message}`)
        case 500:
          throw new Error('Internal server error')
        default:
          throw new Error(`An error occurred: ${message}`)
      }
    }

    // If it's not an Axios error, throw a generic error
    throw new Error('An unexpected error occurred')
  }
}
