import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { ResourceDTO } from './resourceDTO'
import { Resource, type IResource } from '../domain/resource'

export class ResourceMapper extends BaseMapper {
  static toDomain(raw: ResourceDTO,): IResource {
    return new Resource({
      id: raw.id,
      name: raw.name,
      displayName: raw.displayName,
      roles: raw.roles,
    })
  }

  static toDTO(domain: Resource): ResourceDTO {
    const json = domain.toJSON()
    json.roles
    return {
      id: json.id!,
      name: json.name,
      displayName: json.displayName,
      roles: json.roles,
    }
  }
}
