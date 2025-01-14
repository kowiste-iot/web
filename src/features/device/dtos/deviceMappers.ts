import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { DeviceDTO } from './deviceDTO'
import { type IDevice, Device } from '../domain/device'

export class DeviceMapper extends BaseMapper {
  static toDomain(raw: DeviceDTO): IDevice {
    const tZ = this.getOrgTimezone()
    return new Device({
      id: raw.id ? raw.id : '',
      name: raw.name,
      parent: raw.parent,
      updatedAt: raw.updated_at ? new Date(raw.updated_at) : undefined,
    })
  }

  static toDTO(domain: Device): DeviceDTO {
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
