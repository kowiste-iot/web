import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { ResourceDTO } from './resourceDTO'
import { Resource, type IResource } from '../domain/resource'

export class ResourceMapper extends BaseMapper {
  static toDomain(raw: ResourceDTO): IResource {
    return new Resource({
      id: raw.id,
      name: raw.name,
      type: raw.type,
      uris: raw.uris,
      scopes: raw.scopes,
      attributes: raw.attributes,
      displayName: raw.display_name,
      iconUri: raw.icon_uri,
    })
  }

  static toDTO(domain: Resource): ResourceDTO {
    const json = domain.toJSON()
    return {
      id: json.id,
      name: json.name,
      type: json.type,
      uris: json.uris,
      scopes: json.scopes,
      attributes: json.attributes,
      display_name: json.displayName,
      icon_uri: json.iconUri,
    }
  }
}


