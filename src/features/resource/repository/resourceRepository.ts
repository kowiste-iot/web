import axiosInstance, { axiosClient } from '@/utils/http/axios-client'
import {
  Resource,
  type IResource,
  type IResourceRepository,
} from '../domain/resource'
import type { ResourceDTO } from '../dtos/resourceDTO'
import { ResourceMapper } from '../dtos/resourceMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class ResourceRepository extends BaseRepository implements IResourceRepository {
  constructor() {
    super('resources')
  }

  async findById(id: ID): Promise<IResource | null> {
    try {
      const response = await axiosClient().get<ResourceDTO>(
        `${this.baseUrl}/${id}`
      )
      return ResourceMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IResource[]> {
    try {
      const response = await axiosClient().get<ResourceDTO[]>(this.baseUrl)

      return response.data
        .map((dto: ResourceDTO) => ResourceMapper.toDomain(dto))
        .filter(
          (resource: IResource): resource is IResource => resource !== null
        )
    } catch (error) {
      throw error
    }
  }

  async create(data: IResource): Promise<void> {
    try {
      const dto = ResourceMapper.toDTO(new Resource(data))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IResource): Promise<void> {
    try {
      const dto = ResourceMapper.toDTO(new Resource(data))
      await axiosClient().put(`${this.baseUrl}/${data.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
