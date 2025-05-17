// repository/userRepository.ts
import axiosInstance, { axiosClient } from '@/utils/http/axios-client'
import { User, type IUser, type IUserRepository } from '../domain/user'
import type { UserDTO } from '../dtos/userDTO'
import { UserMapper } from '../dtos/userMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor() {
    super('users')
  }

  async findById(id: ID): Promise<IUser | null> {
    try {
      const response = await axiosClient().get<UserDTO>(`${this.baseUrl}/${id}`)
      return UserMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }
  async findAll(): Promise<IUser[]> {
    try {
      const response = await axiosClient().get<UserDTO[]>(this.baseUrl)
      return response.data
        .map((dto: UserDTO) => UserMapper.toDomain(dto))
        .filter((user: IUser): user is IUser => user !== null)
    } catch (error) {
      throw error
    }
  }
  async create(data: IUser): Promise<void> {
    try {
      const dto = UserMapper.toDTO(new User(data))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IUser): Promise<void> {
    try {
      const dto = UserMapper.toDTO(new User(data))
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
