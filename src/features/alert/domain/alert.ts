import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { AlertValidator } from './alertValidator'
import type { IHasParent } from '@/features/shared/domain/hasParent'

export interface IAlert extends IHasParent {
  id: string
  name: string
  parent: string
  enabled: boolean
  description?: string
  updatedAt?: Date
}

export class Alert implements IAlert {
  private static validator = new AlertValidator()

  id: string
  name: string
  parent: string
  enabled: boolean
  description?: string
  updatedAt?: Date

  constructor(props: IAlert) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.enabled = props.enabled
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IAlert>): ValidationError<IAlert> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IAlert>(
    field: K,
    value: IAlert[K]
  ): string {
    return this.validator.validateField(field, value)
  }

  toJSON(): IAlert {
    return {
      id: this.id,
      name: this.name,
      enabled: this.enabled,
      parent: this.parent,
      description: this.description,
    }
  }
}

export interface IAlertRepository {
  findById(id: string): Promise<IAlert | null>
  findAll(): Promise<IAlert[]>
  create(alert: IAlert): Promise<void>
  update(alert: IAlert): Promise<void>
  delete(id: string): Promise<void>
}
