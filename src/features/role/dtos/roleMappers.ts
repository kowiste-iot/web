import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { RoleDTO } from './roleDTO'
import { Role, type IRole } from '../domain/role'

export class RoleMapper extends BaseMapper {
  static toDomain(raw: RoleDTO): IRole {
    const tZ = this.getOrgTimezone()
    return new Role({
      id: raw.id,
      name: raw.name,
      readonly: raw.readonly,
      description: raw.description,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Role): RoleDTO {
    const json = domain.toJSON()
    const tZ = this.getOrgTimezone()

    return {
      id: json.id,
      name: json.name,
      readonly: json.readonly,
      description: json.description,
      updated_at: json.updatedAt?.toOrgTimezone(tZ).toISOString(),
    }
  }
}
