import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IDashboard } from '../domain/dashboard'
import { DashboardService } from '../application/dashboardService'
import { DashboardRepository } from '../repository/dashboardRepository'
import type { ID } from '@/features/shared/domain/id'

export const useDashboardStore = defineStore('dashboardStore', {
  state: () => ({
    dashboards: [] as IDashboard[],
    currentDashboard: null as IDashboard | null,
  }),

  actions: {
    async fetchDashboard(id: ID) {
      const dashboardService = new DashboardService(
        new DashboardRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentDashboard = await dashboardService.getDashboard(id)
    },
    async fetchDashboards() {
      const dashboardService = new DashboardService(
        new DashboardRepository(),
        new NotificationService(useNotificationStore())
      )
      this.dashboards = await dashboardService.getDashboards()
    },
  },
})
