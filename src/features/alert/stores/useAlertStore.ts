import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IAlert } from '../domain/alert'
import { AlertService } from '../application/alertService'
import { AlertRepository } from '../repository/alertRepository'

export const useAlertStore = defineStore('alertStore', {
  state: () => ({
    alerts: [] as IAlert[],
    currentAlert: null as IAlert | null,
  }),

  actions: {
    async fetchAlert(id: string) {
      const alertService = new AlertService(
        new AlertRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentAlert = await alertService.getAlert(id)
    },
    async fetchAlerts() {
      const alertService = new AlertService(
        new AlertRepository(),
        new NotificationService(useNotificationStore())
      )
      this.alerts = await alertService.getAlerts()
    },
  },
})
