import {
  ValidationMapper,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import { DashboardValidator } from './dashboardValidator'
import type { IHasParent } from '@/features/shared/domain/hasParent'
import type { ID } from '@/features/shared/domain/id'

export interface IDashboard extends IHasParent {
  id: ID
  name: string
  parent: ID
  description?: string
  updatedAt?: Date
}

export class Dashboard implements IDashboard {
  private static validator = new DashboardValidator()
  id: ID
  name: string
  parent: ID
  description?: string
  updatedAt?: Date

  constructor(props: IDashboard) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IDashboard>): ValidationError<IDashboard> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IDashboard>(
    field: K,
    value: IDashboard[K],
    currentErrors: ValidationError<IDashboard> | null = null
  ): ValidationError<IDashboard> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }
  toJSON(): IDashboard {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}
export interface IDashboardRepository {
  findById(id: ID): Promise<IDashboard | null>
  findAll(): Promise<IDashboard[]>
  create(asset: IDashboard): Promise<void>
  update(asset: IDashboard): Promise<void>
  delete(id: ID): Promise<void>
}
