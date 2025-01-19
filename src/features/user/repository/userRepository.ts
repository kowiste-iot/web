// repository/userRepository.ts
import axiosServices from '@/shared/http/axios-client'
import { User, type IUser, type IUserRepository } from '../domain/user'
import type { UserDTO } from '../dtos/userDTO'
import { UserMapper } from '../dtos/userMappers'
import { useTenant } from '@/composable/useTenant'

export class UserRepository implements IUserRepository {
  private baseUrl: string

  constructor() {
    const { getTenantId } = useTenant()
    this.baseUrl = `${getTenantId()}/users`
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const response = await axiosServices.get<UserDTO>(`${this.baseUrl}/${id}`)
      return UserMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async updatePreferences(
    id: string,
    preferences: IUser['preferences']
  ): Promise<void> {
    try {
      await axiosServices.patch(
        `${this.baseUrl}/${id}/preferences`,
        preferences
      )
    } catch (error) {
      throw error
    }
  }

  async updateSettings(id: string, settings: IUser['settings']): Promise<void> {
    try {
      await axiosServices.patch(`${this.baseUrl}/${id}/settings`, settings)
    } catch (error) {
      throw error
    }
  }
}
