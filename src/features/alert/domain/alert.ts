import { ValidationMapper, type ValidationError } from '@/features/shared/domain/baseValidator'
import { AlertValidator } from './alertValidator'
import type { IHasParent } from '@/features/shared/domain/hasParent'
import type { ID } from '@/features/shared/domain/id'

export interface IAlert extends IHasParent {
  id: ID
  name: string
  parent: ID
  measures: ID[]
  enabled: boolean
  description?: string
  updatedAt?: Date
}

export class Alert implements IAlert {
  private static validator = new AlertValidator()

  id: ID
  name: string
  parent: ID
  measures: ID[]
  enabled: boolean
  description?: string
  updatedAt?: Date

  constructor(props: IAlert) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.measures = props.measures
    this.enabled = props.enabled
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IAlert>): ValidationError<IAlert> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IAlert>(
    field: K,
    value: IAlert[K],
    currentErrors: ValidationError<IAlert> | null = null
  ): ValidationError<IAlert> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }

  toJSON(): IAlert {
    return {
      id: this.id,
      name: this.name,
      measures: this.measures,
      enabled: this.enabled,
      parent: this.parent,
      description: this.description,
    }
  }
}

export interface IAlertRepository {
  findById(id: ID): Promise<IAlert | null>
  findAll(): Promise<IAlert[]>
  create(alert: IAlert): Promise<void>
  update(alert: IAlert): Promise<void>
  delete(id: ID): Promise<void>
}
