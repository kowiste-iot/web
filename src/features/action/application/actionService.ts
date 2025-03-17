import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { Action, type IAction, type IActionRepository } from '../domain/action'
import { useActionStore } from '../stores/useActionStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import type { ID } from '@/features/shared/domain/id'

const assetStore = useAssetStore()
export class ActionService {
  constructor(
    private readonly actionRepository: IActionRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getAction(id: ID): Promise<IAction | null> {
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
      return SharedAssetMapper.setParentNames(actions, assetStore.assets)
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch actions: ${error.message}`
          : 'Failed to fetch actions'
      this.notificationService.error(msg)
      return []
    }
  }

  async createAction(data: IAction): Promise<boolean> {
    try {
      const errors = Action.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const action = new Action(data)
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
    id: ID
    name: string
    parent: ID
    description?: string
  }): Promise<boolean> {
    try {
      const errors = Action.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      const existingAction = await useActionStore().getActionById(data.id)
      if (!existingAction) throw new Error('Action not found')

      const updatedAction: IAction = {
        ...existingAction,
        name: data.name,
        parent: data.parent,
        description: data.description,
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

  async deleteAction(id: ID): Promise<void> {
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
