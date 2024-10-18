import type { IAsset } from '@/model/asset/asset'
import type { FormAsset } from '@/model/asset/form/form'
import { defineStore } from 'pinia'

interface State {
  _assets: IAsset[]
}

export const useAsset = defineStore('assetStore', {
  state: (): State => ({
    _assets: [
      {
        id: 'kfnwef34kf34',
        name: 'Barcelona',
        parent: '-',
      },
      {
        id: 'qf343469',
        name: 'Office Barcelona',
        parent: 'kfnwef34kf34',
      },
      {
        id: 'kw45tij5gn',
        name: 'Warehouse Barcelona',
        parent: 'kfnwef34kf34',
      },
    ],
  }),
  getters: {
    assets(): IAsset[] {
      return this._assets
    },
  },
  actions: {
    create(data: FormAsset) {
      this._assets.push({
        id: String(this._assets.length),
        name: data.name,
        parent: data.parent,
      })
    },
  },
})
