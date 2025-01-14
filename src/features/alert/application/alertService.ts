import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IAlert, IAlertRepository } from '../domain/alert'

const alertSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(EValidation.NameMin, {
      message: 'Name too short',
    })
    .max(EValidation.NameMax, {
      message: 'Name too long',
    }),
  parent: z.string().uuid({
    message: 'parent not valid uuid',
  }),
  description: z.string().max(EValidation.NameMax, {
    message: 'Description too long',
  }),
})

export class AlertService {
  constructor(
    private readonly alertRepository: IAlertRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getAlert(id: string): Promise<IAlert | null> {
    try {
      const alert = await this.alertRepository.findById(id)
      return alert
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch alert: ${error.message}`
          : 'Failed to fetch alert'
      this.notificationService.error(msg)
      return null
    }
  }

  async getAlerts(): Promise<IAlert[]> {
    try {
      const alerts = await this.alertRepository.findAll()
      return alerts
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch alerts: ${error.message}`
          : 'Failed to fetch alerts'
      this.notificationService.error(msg)
      return []
    }
  }

  async createAlert(data: {
    name: string
    parent: string
    description?: string
  }): Promise<boolean> {
    try {
      const validated = alertSchema.parse(data)
      const alert: IAlert = {
        name: validated.name,
        parent: validated.parent,
        description: validated.description,
      }
      await this.alertRepository.create(alert)
      this.notificationService.success('Alert created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid alert data')
      } else {
        this.notificationService.error('Failed to create alert')
      }
      return false
    }
  }

  async updateAlert(data: {
    id: string
    name: string
    parent: string
    description?: string
  }): Promise<boolean> {
    try {
      const validated = alertSchema.parse(data)
      const existingAlert = await this.getAlert(data.id)
      if (!existingAlert) throw new Error('Alert not found')

      const updatedAlert: IAlert = {
        ...existingAlert,
        name: validated.name,
        parent: validated.parent,
        description: validated.description,
      }

      await this.alertRepository.update(updatedAlert)
      this.notificationService.success('Alert updated successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid alert data')
      } else {
        this.notificationService.error('Failed to update alert')
      }
      return false
    }
  }

  async deleteAlert(id: string): Promise<void> {
    try {
      await this.alertRepository.delete(id)
      this.notificationService.success('Alert deleted successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete alert: ${error.message}`
          : 'Failed to delete alert'
      this.notificationService.error(msg)
    }
  }
}
