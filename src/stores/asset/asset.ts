import type { IAsset } from '@/model/asset/asset'
import type { FormAsset, IFormAsset } from '@/model/asset/form/formAsset'
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
    create(data: IFormAsset) {
      this._assets.push({
        id: String(this._assets.length),
        name: data.name,
        parent: data.parent,
      })
    },
    update(data: IFormAsset) {
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
