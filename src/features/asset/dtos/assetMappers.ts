import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { AssetDTO } from './assetDTO'
import { Asset, type IAsset } from '../domain/asset'

export class AsssetMapper extends BaseMapper {
  static toDomain(raw: AssetDTO): IAsset {
    const tZ = this.getOrgTimezone()
    return new Asset({
      id: raw.id,
      name: raw.name,
      parent: raw.parent,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Asset): AssetDTO {
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
