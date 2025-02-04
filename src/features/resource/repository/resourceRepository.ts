// features/resource/repository/resourceRepository.ts
import axiosServices from '@/shared/http/axios-client'
import {
  Resource,
  type IResource,
  type IResourceRepository,
} from '../domain/resource'
import type { ResourceDTO } from '../dtos/resourceDTO'
import { ResourceMapper } from '../dtos/resourceMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'

export class ResourceRepository
  extends BaseRepository
  implements IResourceRepository
{
  constructor() {
    super('resources')
  }

  async findById(id: string): Promise<IResource | null> {
    try {
      const response = await axiosServices.get<ResourceDTO>(
        `${this.baseUrl}/${id}`
      )
      return ResourceMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IResource[]> {
    try {
      const response = await axiosServices.get<ResourceDTO[]>(this.baseUrl)
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
      await axiosServices.post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IResource): Promise<void> {
    try {
      const dto = ResourceMapper.toDTO(new Resource(data))
      await axiosServices.put(`${this.baseUrl}/${data.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosServices.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
