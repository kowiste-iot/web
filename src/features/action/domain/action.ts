import { ValidationMapper, type ValidationError } from '@/features/shared/domain/baseValidator'
import type { IHasParent } from '@/features/shared/domain/hasParent'
import type { ID } from '@/features/shared/domain/id'
import { ActionValidator } from './actionValidator'

export interface IAction extends IHasParent {
  id: ID
  name: string
  parent: ID
  enabled: boolean
  description?: string
  updatedAt?: Date
}

export class Action implements IAction {
  private static validator = new ActionValidator()

  id: ID
  name: string
  parent: ID
  enabled: boolean
  description?: string
  updatedAt?: Date

  constructor(props: IAction) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.enabled = props.enabled
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IAction>): ValidationError<IAction> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IAction>(
    field: K,
    value: IAction[K],
    currentErrors: ValidationError<IAction> | null = null
  ): ValidationError<IAction> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }
  toJSON(): IAction {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      enabled: this.enabled,
      description: this.description,
    }
  }
}

export interface IActionRepository {
  findById(id: ID): Promise<IAction | null>
  findAll(): Promise<IAction[]>
  create(action: IAction): Promise<void>
  update(action: IAction): Promise<void>
  delete(id: ID): Promise<void>
}
