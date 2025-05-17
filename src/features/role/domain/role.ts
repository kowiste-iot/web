// features/role/domain/role.ts
import {
  ValidationMapper,
  type IError,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import { RoleValidator } from './roleValidator'
import type { ID } from '@/features/shared/domain/id'

export const adminRole = 'admin'
export interface IRole extends IError {
  id: ID
  name: string
  readonly: boolean
  description?: string
  updatedAt?: Date
}

export class Role implements IRole {
  private static validator = new RoleValidator()
  id: ID
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
    value: IRole[K],
    currentErrors: ValidationError<IRole> | null = null
  ): ValidationError<IRole> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }

  toJSON(): IRole {
    return {
      id: this.id,
      name: this.name,
      readonly: this.readonly,
      description: this.description,
    }
  }
}

export interface IRoleRepository {
  findById(id: ID): Promise<IRole | null>
  findAll(): Promise<IRole[]>
  create(role: IRole): Promise<void>
  //update(role: IRole): Promise<void> //dont alow to update roles
  delete(id: ID): Promise<void>
}
