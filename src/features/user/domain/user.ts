// domain/user.ts
import {
  ValidationMapper,
  type IError,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import { UserValidator } from './userValidator'
import type { ID } from '@/features/shared/domain/id'
const itemsToRemove = ['admin']

export interface IUser extends IError {
  id: ID
  firstName: string
  lastName: string
  fullName: string
  email: string
  roles: string[]
}

export class User implements IUser {
  private static validator = new UserValidator()
  id: ID
  firstName: string
  lastName: string
  fullName: string
  email: string
  roles: string[]

  constructor(props: IUser) {
    this.id = props.id
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.fullName = props.lastName + ' ' + props.firstName
    this.email = props.email
    this.roles = props.roles
  }

  static validate(data: Partial<IUser>): ValidationError<IUser> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IUser>(
    field: K,
    value: IUser[K],
    currentErrors: ValidationError<IUser> | null = null
  ): ValidationError<IUser> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }

  toJSON(): IUser {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      roles: this.roles,
    }
  }
}

export interface IUserRepository {
  findById(id: ID): Promise<IUser | null>
  findAll(): Promise<IUser[]>
  create(asset: IUser): Promise<void>
  update(asset: IUser): Promise<void>
  delete(id: ID): Promise<void>
}
