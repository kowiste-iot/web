import type { INotificationService } from '@/features/notification/application/notificationService'
import { Widget, type IWidget, type IWidgetRepository } from '../domain/widget'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

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
      const errors = ValidationError.fromRequest<IWidget>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch widget: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getWidgets(dashboardID: ID): Promise<IWidget[]> {
    try {      
      const widgets = await this.widgetRepository.findAll(dashboardID)
      return widgets
    } catch (error)  {
      const errors = ValidationError.fromRequest<IWidget>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch widget: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createWidget(
    dashboardID: ID,
    data: IWidget
  ): Promise<ValidationError<IWidget> | null> {
    try {
      // const errors = Widget.validate(data)
      // if (errors.hasErrors()) {
      //   return errors
      // } //TODO: put it back when implement
      const widget = new Widget(data)
      await this.widgetRepository.create(dashboardID, widget)
      this.notificationService.success('Widget created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IWidget>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create widget: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateWidget(
    dashboardID: ID,
    data: IWidget
  ): Promise<ValidationError<IWidget> | null> {
    try {
      // const errors = Widget.validate(data)
      // if (errors.hasErrors()) {
      //   return errors
      // }

      await this.widgetRepository.update(dashboardID, data)
      this.notificationService.success('Widget updated successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IWidget>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update widget: ' + errors.getError('gError')!
      )
      return errors
    }
  }
  async updateWidgetPosition(
    dashboardID: ID,
    data: IWidget
  ): Promise<ValidationError<IWidget> | null> {
    try {
      // const errors = Widget.validate(data)
      // if (errors.hasErrors()) {
      //   return errors
      // }

      await this.widgetRepository.updatePosition(dashboardID, data)
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IWidget>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update widget position: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteWidget(dashboardID: ID, id: ID): Promise<void> {
    try {
      await this.widgetRepository.delete(dashboardID, id)
      this.notificationService.success('Widget deleted successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IWidget>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete widget: ' + errors.getError('gError')!
      )
      return
    }
  }
}
