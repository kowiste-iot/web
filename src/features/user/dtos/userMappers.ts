import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { UserDTO } from './userDTO'
import { User, type IUser } from '../domain/user'

export class UserMapper extends BaseMapper {
  static toDomain(raw: UserDTO): IUser {
    const tZ = this.getOrgTimezone()
    return new User({
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      fullName: raw.lastName + ' ' + raw.firstName,
      email: raw.email,
      roles: raw.roles ? raw.roles : [],
    })
  }

  static toDTO(domain: User): UserDTO {
    const json = domain.toJSON()
    const tZ = this.getOrgTimezone()

    return {
      id: json.id,
      firstName: json.firstName,
      lastName: json.lastName,
      email: json.email,
      roles: json.roles,
    }
  }
}
