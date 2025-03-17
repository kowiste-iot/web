import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { Widget, type IWidget, type IWidgetRepository } from '../domain/widget'
import type { ID } from '@/features/shared/domain/id'

export class WidgetService {
  constructor(
    private readonly widgetRepository: IWidgetRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getWidget(dashboardID: ID, id: ID): Promise<IWidget | null> {
    try {
      const widget = await this.widgetRepository.findById(dashboardID, id)
      return widget
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch widget: ${error.message}`
          : 'Failed to fetch widget'
      this.notificationService.error(msg)
      return null
    }
  }

  async getWidgets(dashboardID: ID): Promise<IWidget[]> {
    try {
      const widgets = await this.widgetRepository.findAll(dashboardID)
      return widgets
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch widgets: ${error.message}`
          : 'Failed to fetch widgets'
      this.notificationService.error(msg)
      return []
    }
  }

  async createWidget(dashboardID: ID, data: IWidget): Promise<boolean> {
    try {
      const errors = Widget.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const widget = new Widget(data)
      await this.widgetRepository.create(dashboardID, widget)
      this.notificationService.success('Widget created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid widget data')
      } else {
        this.notificationService.error('Failed to create widget')
      }
      return false
    }
  }

  async updateWidget(dashboardID: ID, data: IWidget): Promise<boolean> {
    try {
      const errors = Widget.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const existingWidget = await this.getWidget(dashboardID, data.id)
      if (!existingWidget) throw new Error('Widget not found')

      await this.widgetRepository.update(dashboardID, data)
      this.notificationService.success('Widget updated successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid widget data')
      } else {
        this.notificationService.error('Failed to update widget')
      }
      return false
    }
  }

  async deleteWidget(dashboardID: ID, id: ID): Promise<void> {
    try {
      await this.widgetRepository.delete(dashboardID, id)
      this.notificationService.success('Widget deleted successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete widget: ${error.message}`
          : 'Failed to delete widget'
      this.notificationService.error(msg)
    }
  }
}
