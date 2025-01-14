import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { EValidation } from '@/features/shared/enum/EValidation'
import {
  Dashboard,
  type IDashboard,
  type IDashboardRepository,
} from '../domain/dashboard'

export class DashboardService {
  constructor(
    private readonly dashboardRepository: IDashboardRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getDashboard(id: string): Promise<IDashboard | null> {
    try {
      const dashboard = await this.dashboardRepository.findById(id)
      return dashboard
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch dashboard: ${error.message}`
          : 'Failed to fetch dashboard'
      this.notificationService.error(msg)
      return null
    }
  }

  async getDashboards(): Promise<IDashboard[]> {
    try {
      const dashboards = await this.dashboardRepository.findAll()
      return dashboards
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch dashboards: ${error.message}`
          : 'Failed to fetch dashboards'
      this.notificationService.error(msg)
      return []
    }
  }

  async createDashboard(data: IDashboard): Promise<boolean> {
    try {
      const errors = Dashboard.validate(data)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      const dashboard = new Dashboard(data)
      await this.dashboardRepository.create(dashboard)
      this.notificationService.success('Dashboard created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid dashboard data')
      } else {
        this.notificationService.error('Failed to create dashboard')
      }
      return false
    }
  }

  async updateDashboard(data: IDashboard): Promise<boolean> {
    try {
      const errors = Dashboard.validate(data)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const existingDashboard = await this.getDashboard(data.id)
      if (!existingDashboard) throw new Error('Dashboard not found')

      const dashboard = new Dashboard({ ...existingDashboard, ...data })

      await this.dashboardRepository.update(dashboard)
      this.notificationService.success('Dashboard update successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid dashboard data')
      } else {
        this.notificationService.error('Failed to update dashboard')
      }
      return false
    }
  }

  async deleteDashboard(id: string): Promise<void> {
    try {
      await this.dashboardRepository.delete(id)
      this.notificationService.success('Dashboard delete successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete dashboard: ${error.message}`
          : 'Failed to delete dashboard'
      this.notificationService.error(msg)
    }
  }
}
