import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { ActionDTO } from './actionDTO'
import { type IAction, Action } from '../domain/action'

export class ActionMapper extends BaseMapper {
  static toDomain(raw: ActionDTO): IAction {
    const tZ = this.getOrgTimezone()
    return new Action({
      id: raw.id,
      name: raw.name,
      parent: raw.parent,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Action): ActionDTO {
    const json = domain.toJSON()
    const tZ = this.getOrgTimezone()

    return {
      id: json.id,
      name: json.name,
      parent: json.parent,
      description: json.description,
      updated_at: json.updatedAt?.toOrgTimezone(tZ).toISOString(),
    }
  }
}
