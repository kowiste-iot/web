import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IMeasure } from '../domain/measure'
import { MeasureService } from '../application/measureService'
import { MeasureRepository } from '../repository/measureRepository'

export const useMeasureStore = defineStore('measureStore', {
  state: () => ({
    measures: [] as IMeasure[],
    currentMeasure: null as IMeasure | null,
  }),

  actions: {
    async fetchMeasure(id: string) {
      const measureService = new MeasureService(
        new MeasureRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentMeasure = await measureService.fetchMeasure(id)
    },
    async fetchMeasures() {
      const measureService = new MeasureService(
        new MeasureRepository(),
        new NotificationService(useNotificationStore())
      )
      this.measures = await measureService.fetchMeasures()
    },
  },
})
