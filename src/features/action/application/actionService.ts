import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IAction, IActionRepository } from '../domain/action'

const actionSchema = z.object({
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

export class ActionService {
  constructor(
    private readonly actionRepository: IActionRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getAction(id: string): Promise<IAction | null> {
    try {
      const action = await this.actionRepository.findById(id)
      return action
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch action: ${error.message}`
          : 'Failed to fetch action'
      this.notificationService.error(msg)
      return null
    }
  }

  async getActions(): Promise<IAction[]> {
    try {
      const actions = await this.actionRepository.findAll()
      return actions
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch actions: ${error.message}`
          : 'Failed to fetch actions'
      this.notificationService.error(msg)
      return []
    }
  }

  async createAction(data: {
    name: string
    parent: string
    description?: string
  }): Promise<boolean> {
    try {
      const validated = actionSchema.parse(data)
      const action: IAction = {
        name: validated.name,
        parent: validated.parent,
        description: validated.description,
      }
      await this.actionRepository.create(action)
      this.notificationService.success('Action created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid action data')
      } else {
        this.notificationService.error('Failed to create action')
      }
      return false
    }
  }

  async updateAction(data: {
    id: string
    name: string
    parent: string
    description?: string
  }): Promise<boolean> {
    try {
      const validated = actionSchema.parse(data)
      const existingAction = await this.getAction(data.id)
      if (!existingAction) throw new Error('Action not found')

      const updatedAction: IAction = {
        ...existingAction,
        name: validated.name,
        parent: validated.parent,
        description: validated.description,
      }

      await this.actionRepository.update(updatedAction)
      this.notificationService.success('Action updated successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid action data')
      } else {
        this.notificationService.error('Failed to update action')
      }
      return false
    }
  }

  async deleteAction(id: string): Promise<void> {
    try {
      await this.actionRepository.delete(id)
      this.notificationService.success('Action deleted successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete action: ${error.message}`
          : 'Failed to delete action'
      this.notificationService.error(msg)
    }
  }
}
