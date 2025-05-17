import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { DeviceDTO } from './deviceDTO'
import { type IDevice, type IDevicePassword, Device } from '../domain/device'

export class DeviceMapper extends BaseMapper {
  static toDomain(rawDevice: DeviceDTO): IDevice {
    const tZ = this.getOrgTimezone()
    return new Device({
      id: rawDevice.id ? rawDevice.id : '',
      name: rawDevice.name,
      parent: rawDevice.parent,
      description: rawDevice.description,
      updatedAt: rawDevice.updated_at
        ? new Date(rawDevice.updated_at)
        : undefined,
    })
  }
  static toDevicePassword(rawDevicePassword: IDevicePassword): IDevicePassword {
    return {
      id: `device_${rawDevicePassword.id}`,
      clientID: rawDevicePassword.id,
      password: rawDevicePassword.password,
    }
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
