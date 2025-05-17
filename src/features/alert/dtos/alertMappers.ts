import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { AlertDTO } from './alertDTO'
import { type IAlert, Alert } from '../domain/alert'

export class AlertMapper extends BaseMapper {
  static toDomain(raw: AlertDTO): IAlert {
    const tZ = this.getOrgTimezone()
    return new Alert({
      id: raw.id,
      name: raw.name,
      parent: raw.parent,
      measures: raw.measures,
      enabled: raw.enabled,
      description: raw.description,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Alert): AlertDTO {
    const json = domain.toJSON()
    const tZ = this.getOrgTimezone()

    return {
      id: json.id,
      name: json.name,
      parent: json.parent,
      measures: json.measures,
      enabled: json.enabled,
      description: json.description,
      updated_at: json.updatedAt?.toOrgTimezone(tZ).toISOString(),
    }
  }
}
