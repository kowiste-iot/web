import { AlertValidator } from '@/features/alert/domain/alertValidator'
import type { ValidationError } from '@/features/shared/domain/baseValidator'

export interface IAction {
  id: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date
}

export class Action implements IAction {
  private static validator = new AlertValidator()

  id: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date

  constructor(props: IAction) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IAction>): ValidationError<IAction> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IAction>(
    field: K,
    value: IAction[K]
  ): string {
    return this.validator.validateField(field, value)
  }
  toJSON(): IAction {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}

export interface IActionRepository {
  findById(id: string): Promise<IAction | null>
  findAll(): Promise<IAction[]>
  create(action: IAction): Promise<void>
  update(action: IAction): Promise<void>
  delete(id: string): Promise<void>
}
