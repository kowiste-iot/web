import { BaseRepository } from '@/shared/repositories/BaseRepository'
import { User } from '../domain/User'
import { type CreateUserParams, type UpdateUserParams } from '../domain/types'
import { type UserDTO } from './UserDTO'
import { type IUserRepository } from '../domain/IUserRepository'
import { ApiClient } from '@/shared/api/client'

export class UserRepository
  extends BaseRepository<User, CreateUserParams, UpdateUserParams, UserDTO>
  implements IUserRepository
{
  constructor(apiClient: ApiClient) {
    super(apiClient, '/users')
  }

  mapToDomain(dto: UserDTO): User {
    return new User(
      dto.id,
      dto.full_name,
      dto.email,
      dto.is_active,
      dto.role as any, // or add proper validation
      new Date(dto.created_at),
    )
  }

  mapToDto(params: CreateUserParams | UpdateUserParams): Partial<UserDTO> {
    return {
      ...(params.name && { full_name: params.name }),
      ...(params.email && { email: params.email }),
      ...(params.isActive !== undefined && { is_active: params.isActive }),
      ...(params.role && { role: params.role }),
    }
  }
}
