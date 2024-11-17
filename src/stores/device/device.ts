import type { IDevice } from '@/model/device/device'
import type { IFormDevice } from '@/model/device/form/formDevice'
import { defineStore } from 'pinia'

interface State {
  _devices: IDevice[]
}

export const useDevice = defineStore('deviceStore', {
  state: (): State => ({
    _devices: [],
  }),
  getters: {
    devices(): IDevice[] {
      return this._devices
    },
  },
  actions: {
    create(data: IFormDevice) {
      this._devices.push({
        id: String(this._devices.length),
        name: data.name,
        parent: data.parent,
      })
    },
    update(data: IFormDevice) {
      const indexDevice = this._devices.findIndex(
        (device) => device.id == data.id
      )
      if (indexDevice < 0) return
      this._devices[indexDevice] = data
    },
    delete(data: IDevice) {
      this._devices = this._devices.filter((device) => {
        return device.id != data.id
      })
    },
  },
})
