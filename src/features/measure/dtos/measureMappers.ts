import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { MeasureDTO } from './measureDTO'
import { Measure, type IMeasure } from '../domain/measure'
import type { IAsset } from '@/features/asset/domain/asset'

export class MeasureMapper extends BaseMapper {
  static toDomain(raw: MeasureDTO, assets: IAsset[]): IMeasure {
    const tZ = this.getOrgTimezone()
    
    return new Measure({
      id: raw.id,
      name: raw.name,
      parent: raw.parent,
      description: raw.description,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Measure): MeasureDTO {
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
