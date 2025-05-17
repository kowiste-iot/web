import type { INotificationService } from '@/features/notification/application/notificationService'
import { Alert, type IAlert, type IAlertRepository } from '../domain/alert'
import { useAlertStore } from '../stores/useAlertStore'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

const assetStore = useAssetStore()

export class AlertService {
  constructor(
    private readonly alertRepository: IAlertRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getAlert(id: ID): Promise<IAlert | null> {
    try {
      const alert = await this.alertRepository.findById(id)
      return alert
    } catch (error) {
      const errors = ValidationError.fromRequest<IAlert>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch alert: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getAlerts(): Promise<IAlert[]> {
    try {
      const alerts = await this.alertRepository.findAll()
      return SharedAssetMapper.setParentNames(alerts, assetStore.assets)
    } catch (error) {
      const errors = ValidationError.fromRequest<IAlert>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch alert: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createAlert(data: IAlert): Promise<ValidationError<IAlert> | null> {
    try {
      const errors = Alert.validate(data)
      if (errors.hasErrors()) {
        return errors
      }
      const alert = new Alert(data)
      await this.alertRepository.create(alert)
      this.notificationService.success('Alert created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IAlert>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create alert: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateAlert(data: {
    id: string
    name: string
    parent: string
    description?: string
  }): Promise<ValidationError<IAlert> | null> {
    try {
      const errors = Alert.validate(data)

      if (errors.hasErrors()) {
        return errors
      }

      const existingAlert = await useAlertStore().getAlertById(data.id)
      if (!existingAlert) throw new Error('Alert not found')

      const updatedAlert: IAlert = {
        ...existingAlert,
        name: data.name,
        parent: data.parent,
        description: data.description,
      }

      await this.alertRepository.update(updatedAlert)
      this.notificationService.success('Alert updated successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IAlert>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update alert: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteAlert(id: string): Promise<void> {
    try {
      await this.alertRepository.delete(id)
      this.notificationService.success('Alert deleted successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IAlert>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete alert: ' + errors.getError('gError')!
      )
      return
    }
  }
}
