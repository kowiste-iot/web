// features/role/repository/roleRepository.ts
import { axiosClient } from '@/utils/http/axios-client'
import { Role, type IRole, type IRoleRepository } from '../domain/role'
import type { RoleDTO } from '../dtos/roleDTO'
import { RoleMapper } from '../dtos/roleMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class RoleRepository extends BaseRepository implements IRoleRepository {
  constructor() {
    super('roles')
  }

  async findById(id: ID): Promise<IRole | null> {
    try {
      const response = await axiosClient().get<RoleDTO>(`${this.baseUrl}/${id}`)
      return RoleMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IRole[]> {
    try {
      const response = await axiosClient().get<RoleDTO[]>(this.baseUrl)
      return response.data
        .map((dto: RoleDTO) => RoleMapper.toDomain(dto))
        .filter((role: IRole): role is IRole => role !== null)
    } catch (error) {
      throw error
    }
  }

  async create(data: IRole): Promise<void> {
    try {
      const dto = RoleMapper.toDTO(new Role(data))
      await axiosClient().post(this.baseUrl, dto)
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
