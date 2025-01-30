import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IMeasure } from '../domain/measure'
import { MeasureService } from '../application/measureService'
import { MeasureRepository } from '../repository/measureRepository'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'

export const useMeasureStore = defineStore('measureStore', {
  state: () => ({
    measures: [] as IMeasure[],
    currentMeasure: null as IMeasure | null,
  }),
  getters: {
    getMeasureById: (state) => {
      return (id: string): IMeasure | undefined => {
        return state.measures.find((measure) => measure.id === id)
      }
    },
  },
  actions: {
    async fetchMeasure(id: string) {
      const measureService = new MeasureService(
        new MeasureRepository(),
        new NotificationService(useNotificationStore()),
        useAssetStore()
      )
      this.currentMeasure = await measureService.fetchMeasure(id)
    },
    async fetchMeasures() {
      const measureService = new MeasureService(
        new MeasureRepository(),
        new NotificationService(useNotificationStore()),
        useAssetStore()
      )
      this.measures = await measureService.fetchMeasures()
    },
  },
})
