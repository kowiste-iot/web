import { ApiClient } from '@/shared/api/client'
import { type ApiResponse } from '@/shared/api/types'
import type { BaseModel } from '../models/BaseModel'

export abstract class BaseRepository<
  T extends BaseModel,
  CreateParams,
  UpdateParams,
  DTO = any
> {
  constructor(
    protected readonly apiClient: ApiClient,
    protected readonly endpoint: string
  ) {}

  abstract mapToDomain(dto: DTO): T
  abstract mapToDto(params: CreateParams | UpdateParams): Partial<DTO>

  async findAll(): Promise<T[]> {
    const response = await this.apiClient.instance.get<ApiResponse<DTO[]>>(
      this.endpoint
    )
    return response.data.data.map((dto) => this.mapToDomain(dto))
  }

  async findById(id: number): Promise<T | null> {
    try {
      const response = await this.apiClient.instance.get<ApiResponse<DTO>>(
        `${this.endpoint}/${id}`
      )
      return this.mapToDomain(response.data.data)
    } catch (error: any) {
      if (error.response?.status === 404) return null
      throw error
    }
  }

  async create(params: CreateParams): Promise<T> {
    const dto = this.mapToDto(params)
    const response = await this.apiClient.instance.post<ApiResponse<DTO>>(
      this.endpoint,
      dto
    )
    return this.mapToDomain(response.data.data)
  }

  async update(id: number, params: UpdateParams): Promise<T> {
    const dto = this.mapToDto(params)
    const response = await this.apiClient.instance.patch<ApiResponse<DTO>>(
      `${this.endpoint}/${id}`,
      dto
    )
    return this.mapToDomain(response.data.data)
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.instance.delete(`${this.endpoint}/${id}`)
  }
}
