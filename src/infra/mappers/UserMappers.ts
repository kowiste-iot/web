import { User } from '@/domain/models/User'
import type { UserDTO } from '../api/dto/UserDTO'

export class UserMapper {
  public static toDomain(dto: UserDTO): User {
    return new User(
      dto.id,
      dto.full_name,
      dto.email,
      new Date(dto.created_at),
      dto.is_active,
      dto.role
    )
  }

  public static toDTO(domain: User): UserDTO {
    return {
      id: domain.id,
      full_name: domain.name,
      email: domain.email,
      created_at: domain.createdAt.toISOString(),
      is_active: domain.isActive,
      role: domain.role,
    }
  }
}
