// features/device/application/deviceService.ts
import { Device } from '../domain/device'
import type { IDevice, IDeviceRepository } from '../domain/device'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { useDeviceStore } from '../stores/useDeviceStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import type { ID } from '@/features/shared/domain/id'

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
      const msg =
        error instanceof Error
          ? `Failed to fetch device: ${error.message}`
          : 'Failed to fetch device'
      this.notificationService.error(msg)
      return null
    }
  }

  async getDevices(): Promise<IDevice[]> {
    try {
      const devices = await this.deviceRepository.findAll()
      return SharedAssetMapper.setParentNames(devices, assetStore.assets)
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch devices: ${error.message}`
          : 'Failed to fetch devices'
      this.notificationService.error(msg)
      return []
    }
  }

  async createDevice(data: IDevice): Promise<boolean> {
    try {
      const errors = Device.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      const device = new Device(data)
      await this.deviceRepository.create(device)
      this.notificationService.success('Device created successfully')
      return true
    } catch (error) {
      this.notificationService.error('Failed to create device')
      return false
    }
  }

  async updateDevice(data: IDevice): Promise<boolean> {
    try {
      const errors = Device.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      const existingDevice = await useDeviceStore().getDeviceById(data.id)
      if (!existingDevice) {
        throw new Error('Device not found')
      }

      const device = new Device({ ...existingDevice, ...data })
      await this.deviceRepository.update(device)
      this.notificationService.success('Device updated successfully')
      return true
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to update device: ${error.message}`
          : 'Failed to update device'
      this.notificationService.error(msg)
      return false
    }
  }

  async deleteDevice(id: ID): Promise<void> {
    try {
      await this.deviceRepository.delete(id)
      this.notificationService.success('Device deleted successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete device: ${error.message}`
          : 'Failed to delete device'
      this.notificationService.error(msg)
    }
  }
}
