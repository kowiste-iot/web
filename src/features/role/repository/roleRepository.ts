// features/role/repository/roleRepository.ts
import axiosServices from '@/shared/http/axios-client'
import { Role, type IRole, type IRoleRepository } from '../domain/role'
import type { RoleDTO } from '../dtos/roleDTO'
import { RoleMapper } from '../dtos/roleMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'

export class RoleRepository extends BaseRepository implements IRoleRepository {
  constructor() {
    super('roles')
  }

  async findById(id: string): Promise<IRole | null> {
    try {
      const response = await axiosServices.get<RoleDTO>(`${this.baseUrl}/${id}`)
      return RoleMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IRole[]> {
    try {
      const response = await axiosServices.get<RoleDTO[]>(this.baseUrl)
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
      await axiosServices.post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }
  //cant update
  // async update(data: IRole): Promise<void> {
  //   try {
  //     const dto = RoleMapper.toDTO(new Role(data))
  //     await axiosServices.put(`${this.baseUrl}/${data.id}`, dto)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  async delete(id: string): Promise<void> {
    try {
      await axiosServices.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
