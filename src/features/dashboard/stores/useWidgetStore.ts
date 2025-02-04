import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IWidget } from '../domain/widget'
import { WidgetService } from '../application/widgetService'
import { WidgetRepository } from '../repository/widgetRepository'

export const useWidgetStore = defineStore('widgetStore', {
  state: () => ({
    widgets: [] as IWidget[],
    currentWidget: null as IWidget | null,
  }),

  actions: {
    async fetchWidget(id: string) {
      const widgetService = new WidgetService(
        new WidgetRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentWidget = await widgetService.getWidget(id)
    },
    async fetchWidgets() {
      const widgetService = new WidgetService(
        new WidgetRepository(),
        new NotificationService(useNotificationStore())
      )
      this.widgets = await widgetService.getWidgets()
    },
  },
})
