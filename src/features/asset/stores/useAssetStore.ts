
import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IAsset } from '../domain/asset'
import { AssetService } from '../application/assetService'
import { AssetRepository } from '../repository/assetRepository'
import type { ID } from '@/features/shared/domain/id'

export const useAssetStore = defineStore('assetStore', {
  state: () => ({
    assets: [] as IAsset[],
    currentAsset: null as IAsset | null,
  }),
  getters: {
    getAssetById: (state) => {
      return (id: ID): IAsset | undefined => {
        return state.assets.find((asset) => asset.id === id)
      }
    },
  },
  actions: {
    async fetchAsset(id: ID) {
      const assetService = new AssetService(
        new AssetRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentAsset = await assetService.getAsset(id)
    },
    async fetchAssets() {
      const assetService = new AssetService(
        new AssetRepository(),
        new NotificationService(useNotificationStore())
      )
      this.assets = await assetService.getAssets()
    },
  },
})
