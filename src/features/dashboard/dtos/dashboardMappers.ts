import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { DashboardDTO } from './dashboardDTO'
import  {type  IDashboard ,Dashboard} from '../domain/dashboard'

export class DashboardMapper extends BaseMapper {
  static toDomain(raw: DashboardDTO): IDashboard {
    const tZ = this.getOrgTimezone()
    return new Dashboard({
      id: raw.id,
      name: raw.name,
      parent: raw.parent,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Dashboard): DashboardDTO {
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
