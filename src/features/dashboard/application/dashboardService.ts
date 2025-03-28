import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import {
  Dashboard,
  type IDashboard,
  type IDashboardRepository,
} from '../domain/dashboard'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

const assetStore = useAssetStore()

export class DashboardService {
  constructor(
    private readonly dashboardRepository: IDashboardRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getDashboard(id: ID): Promise<IDashboard | null> {
    try {
      const dashboard = await this.dashboardRepository.findById(id)
      return dashboard
    } catch (error) {
      const errors = ValidationError.fromRequest<IDashboard>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch dashboard: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getDashboards(): Promise<IDashboard[]> {
    try {
      const dashboards = await this.dashboardRepository.findAll()
      return SharedAssetMapper.setParentNames(dashboards, assetStore.assets)
    } catch (error) {
      const errors = ValidationError.fromRequest<IDashboard>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch dashboard: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createDashboard(
    data: IDashboard
  ): Promise<ValidationError<IDashboard> | null> {
    try {
      const errors = Dashboard.validate(data)
      if (errors.hasErrors()) {
        return errors
      }

      const dashboard = new Dashboard(data)
      await this.dashboardRepository.create(dashboard)
      this.notificationService.success('Dashboard created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IDashboard>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create dashboard: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateDashboard(data: IDashboard): Promise<ValidationError<IDashboard> | null> {
    try {
      const errors = Dashboard.validate(data)
      if (errors.hasErrors()) {
       return errors
      }
      const existingDashboard = await this.getDashboard(data.id)
      if (!existingDashboard) throw new Error('Dashboard not found')

      const dashboard = new Dashboard({ ...existingDashboard, ...data })

      await this.dashboardRepository.update(dashboard)
      this.notificationService.success('Dashboard update successfully')
      return null
    } catch (error) {
    const errors = ValidationError.fromRequest<IDashboard>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update dashboard: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteDashboard(id: ID): Promise<void> {
    try {
      await this.dashboardRepository.delete(id)
      this.notificationService.success('Dashboard delete successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IDashboard>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete dashboard: ' + errors.getError('gError')!
      )
      return
    }
  }
}
