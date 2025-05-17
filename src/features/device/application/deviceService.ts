// features/device/application/deviceService.ts
import { Device } from '../domain/device'
import type { IDevice, IDeviceRepository } from '../domain/device'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { useDeviceStore } from '../stores/useDeviceStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'
import type { CreateResult } from '@/features/shared/domain/reponse'

const assetStore = useAssetStore()

export class DeviceService {
  constructor(
    private readonly deviceRepository: IDeviceRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getDevice(id: ID): Promise<IDevice | null> {
    try {
      const device = await this.deviceRepository.findById(id)
      return device
    } catch (error) {
      const errors = ValidationError.fromRequest<IDevice>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch device: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getDevices(): Promise<IDevice[]> {
    try {
      const devices = await this.deviceRepository.findAll()
      return SharedAssetMapper.setParentNames(devices, assetStore.assets)
    } catch (error) {
      const errors = ValidationError.fromRequest<IDevice>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch device: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createDevice(data: IDevice): Promise<CreateResult<IDevice>> {
    try {
      const errors = Device.validate(data)
      if (errors.hasErrors()) {
        return { error: errors, data: null }
      }

      const device = new Device(data)
      const resp = await this.deviceRepository.create(device)

      this.notificationService.success('Device created successfully')
      return { error: null, data: resp }
    } catch (error) {
      const errors = ValidationError.fromRequest<IDevice>(error)
      if (!errors.hasErrors()) return { error: null, data: null }
      this.notificationService.error(
        'Fail to create device: ' + errors.getError('gError')!
      )
      return { error: errors, data: null }
    }
  }

  async updateDevice(data: IDevice): Promise<ValidationError<IDevice> | null> {
    try {
      const errors = Device.validate(data)
      if (errors.hasErrors()) {
        return errors
      }

      const existingDevice = await useDeviceStore().getDeviceById(data.id)
      if (!existingDevice) {
        throw new Error('Device not found')
      }

      const device = new Device({ ...existingDevice, ...data })
      await this.deviceRepository.update(device)
      this.notificationService.success('Device updated successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IDevice>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update device: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteDevice(id: ID): Promise<void> {
    try {
      await this.deviceRepository.delete(id)
      this.notificationService.success('Device deleted successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IDevice>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete device: ' + errors.getError('gError')!
      )
      return
    }
  }
}
