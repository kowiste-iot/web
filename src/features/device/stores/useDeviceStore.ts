import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IDevice } from '../domain/device'
import { DeviceService } from '../application/deviceService'
import { DeviceRepository } from '../repository/deviceRepository'
import type { ID } from '@/features/shared/domain/id'

export const useDeviceStore = defineStore('deviceStore', {
  state: () => ({
    devices: [] as IDevice[],
    currentDevice: null as IDevice | null,
  }),
  getters: {
    getDeviceById: (state) => {
      return (id: ID): IDevice | undefined => {
        return state.devices.find((device) => device.id === id)
      }
    },
  },
  actions: {
    async fetchDevice(id: ID) {
      const deviceService = new DeviceService(
        new DeviceRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentDevice = await deviceService.getDevice(id)
    },
    async fetchDevices() {
      const deviceService = new DeviceService(
        new DeviceRepository(),
        new NotificationService(useNotificationStore())
      )
      this.devices = await deviceService.getDevices()
    },
  },
})
