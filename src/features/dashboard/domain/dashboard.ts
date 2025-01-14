import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { DashboardValidator } from './dashboardValidator'

export interface IDashboard {
  id: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date
}

export class Dashboard implements IDashboard {
  private static validator = new DashboardValidator()
  id: string
  name: string
  parent: string
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
    value: IDashboard[K]
  ): string {
    return this.validator.validateField(field, value)
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
  findById(id: string): Promise<IDashboard | null>
  findAll(): Promise<IDashboard[]>
  create(asset: IDashboard): Promise<void>
  update(asset: IDashboard): Promise<void>
  delete(id: string): Promise<void>
}
