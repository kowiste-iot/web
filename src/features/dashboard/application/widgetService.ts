import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IWidget, IWidgetData, IWidgetLinkData, IWidgetRepository } from '../domain/widget'
import { EWidget } from '../domain/EWidget'

const widgetLinkSchema = z.object({
  measure: z.string(),
  tag: z.string(),
  legend: z.string(),
})

const widgetDataSchema = z.object({
  label: z.string(),
  showLabel: z.boolean(),
  showEmotion: z.boolean(),
  trueEmotion: z.boolean(),
  link: z.array(widgetLinkSchema),
  options: z.any(),
})

const widgetSchema = z.object({
  dashboardID: z.string().uuid({
    message: 'Dashboard ID must be a valid UUID',
  }),
  type: z.nativeEnum(EWidget),
  i: z.number(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  data: widgetDataSchema,
})

export class WidgetService {
  constructor(
    private readonly widgetRepository: IWidgetRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getWidget(id: string): Promise<IWidget | null> {
    try {
      const widget = await this.widgetRepository.findById(id)
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

  async getWidgets(): Promise<IWidget[]> {
    try {
      const widgets = await this.widgetRepository.findAll()
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

  async createWidget(data: IWidget): Promise<boolean> {
    try {
      const validated = widgetSchema.parse(data)
      await this.widgetRepository.create(validated)
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

  async updateWidget(data: IWidget): Promise<boolean> {
    try {
      const validated = widgetSchema.parse(data)
      const existingWidget = await this.getWidget(data.id)
      if (!existingWidget) throw new Error('Widget not found')

      await this.widgetRepository.update(data)
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

  async deleteWidget(id: string): Promise<void> {
    try {
      await this.widgetRepository.delete(id)
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
