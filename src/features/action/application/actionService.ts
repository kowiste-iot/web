import type { INotificationService } from '@/features/notification/application/notificationService'
import { Action, type IAction, type IActionRepository } from '../domain/action'
import { useActionStore } from '../stores/useActionStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

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
      const errors = ValidationError.fromRequest<IAction>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch action: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getActions(): Promise<IAction[]> {
    try {
      const actions = await this.actionRepository.findAll()
      return SharedAssetMapper.setParentNames(actions, assetStore.assets)
    } catch (error) {
      const errors = ValidationError.fromRequest<IAction>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch actions: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createAction(data: IAction): Promise<ValidationError<IAction> | null> {
    try {
      const errors = Action.validate(data)
      if (errors.hasErrors()) {
        return errors
      }
      const action = new Action(data)
      await this.actionRepository.create(action)
      this.notificationService.success('Action created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IAction>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create action: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateAction(data: {
    id: ID
    name: string
    parent: ID
    description?: string
  }): Promise<ValidationError<IAction> | null> {
    try {
      const errors = Action.validate(data)
      if (errors.hasErrors()) {
        return errors
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
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IAction>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update action: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteAction(id: ID): Promise<void> {
    try {
      await this.actionRepository.delete(id)
      this.notificationService.success('Action deleted successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IAction>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete action: ' + errors.getError('gError')!
      )
      return
    }
  }
}
