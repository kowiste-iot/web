// features/role/domain/role.ts
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { RoleValidator } from './roleValidator'

export interface IRole {
  id: string
  name: string
  readonly: boolean
  description?: string
  updatedAt?: Date
}

export class Role implements IRole {
  private static validator = new RoleValidator()
  id: string
  name: string
  readonly: boolean
  description?: string
  updatedAt?: Date

  constructor(props: IRole) {
    this.id = props.id
    this.name = props.name
    this.readonly = props.readonly
    this.description = props.description
    this.updatedAt = props.updatedAt
  }

  static validate(data: Partial<IRole>): ValidationError<IRole> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IRole>(
    field: K,
    value: IRole[K]
  ): string {
    return this.validator.validateField(field, value)
  }

  toJSON(): IRole {
    return {
      id: this.id,
      name: this.name,
      readonly:this.readonly,
      description: this.description,
    }
  }
}

export interface IRoleRepository {
  findById(id: string): Promise<IRole | null>
  findAll(): Promise<IRole[]>
  create(role: IRole): Promise<void>
  //update(role: IRole): Promise<void> //dont alow to update roles
  delete(id: string): Promise<void>
}
