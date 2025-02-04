import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { UserDTO } from './userDTO'
import { User, type IUser } from '../domain/user'

export class UserMapper extends BaseMapper {
  static toDomain(raw: UserDTO): IUser {
    const tZ = this.getOrgTimezone()
    return new User({
      id: raw.id,
      firstName: raw.first_name,
      lastName: raw.last_name,
      fullName: raw.full_name,
      email: raw.email,
      roles: raw.roles,
      branches: raw.branches,
      preferences: raw.preferences,
      settings: {
        defaultView: raw.settings.default_view,
        timezone: raw.settings.timezone,
      },
    })
  }

  static toDTO(domain: User): UserDTO {
    const json = domain.toJSON()
    const tZ = this.getOrgTimezone()

    return {
      id: json.id,
      first_name: json.firstName,
      last_name: json.lastName,
      full_name: json.fullName,
      email: json.email,
      roles: json.roles,
      branches: json.branches,
      preferences: json.preferences,
      settings: {
        default_view: json.settings.defaultView,
        timezone: json.settings.timezone,
      },
    }
  }
}
