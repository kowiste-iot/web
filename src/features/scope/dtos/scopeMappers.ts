import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { ScopeDTO } from './scopeDTO'
import { Scope, type IScope } from '../domain/scope'

export class ScopeMapper extends BaseMapper {
  static toDomain(raw: ScopeDTO): IScope {
    return new Scope({
      id: raw.id,
      name: raw.name,
      displayName: raw.displayName,
    })
  }

  static toDTO(domain: Scope): ScopeDTO {
    const json = domain.toJSON()
    return {
      id: json.id!,
      name: json.name,
      displayName: json.displayName,
    }
  }
}
