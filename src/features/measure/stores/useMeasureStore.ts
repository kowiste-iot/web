import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IMeasure } from '../domain/measure'
import { MeasureService } from '../application/measureService'
import { MeasureRepository } from '../repository/measureRepository'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import type { ID } from '@/features/shared/domain/id'

export const useMeasureStore = defineStore('measureStore', {
  state: () => ({
    measures: [] as IMeasure[],
    currentMeasure: null as IMeasure | null,
  }),
  getters: {
    getMeasureById: (state) => {
      return (id: ID): IMeasure | undefined => {
        return state.measures.find((measure) => measure.id === id)
      }
    },
  },
  actions: {
    async fetchMeasure(id: ID) {
      const measureService = new MeasureService(
        new MeasureRepository(),
        new NotificationService(useNotificationStore()),
        useAssetStore()
      )
      this.currentMeasure = await measureService.getMeasure(id)
    },
    async fetchMeasures() {
      const measureService = new MeasureService(
        new MeasureRepository(),
        new NotificationService(useNotificationStore()),
        useAssetStore()
      )
      this.measures = await measureService.getMeasures()
    },
  },
})
