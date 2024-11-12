import type { IAsset } from '@/model/asset/asset'
import type { FormAsset } from '@/model/asset/form/form'
import { defineStore } from 'pinia'

interface State {
  _assets: IAsset[]
}

export const useAsset = defineStore('assetStore', {
  state: (): State => ({
    _assets: [],
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
    update(data: FormAsset) {
      const indexAsset = this._assets.findIndex((asset) => asset.id == data.id)
      if (indexAsset < 0) return
      this._assets[indexAsset] = data
    },
    delete(data: IAsset) {
      this._assets = this._assets.filter((asset) => {
        return asset.id != data.id
      })
    },
  },
})
