import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IWidget, IWidgetLinkData } from '../domain/widget'
import { WidgetService } from '../application/widgetService'
import { WidgetRepository } from '../repository/widgetRepository'
import type { ID } from '@/features/shared/domain/id'

export const useWidgetStore = defineStore('widgetStore', {
  state: () => ({
    widgets: [] as IWidget[],
    currentWidget: null as IWidget | null,
  }),
  getters: {
    uniqueMeasures(): ID[] {
      const allMeasures = this.widgets.flatMap((widget: IWidget) =>
        // For each widget, get all measures from link array
        widget.data.link.map((linkData: IWidgetLinkData) => linkData.measure)
      )
      return [...new Set(allMeasures)]
    },
  },

  actions: {
    async fetchWidget(dashboardID: ID, id: ID) {
      const widgetService = new WidgetService(
        new WidgetRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentWidget = await widgetService.getWidget(dashboardID, id)
    },
    async fetchWidgets(dashboardID: ID) {
      const widgetService = new WidgetService(
        new WidgetRepository(),
        new NotificationService(useNotificationStore())
      )
      this.widgets = await widgetService.getWidgets(dashboardID)
    },
  },
})
