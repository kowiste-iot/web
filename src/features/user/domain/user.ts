// domain/user.ts
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { UserValidator } from './userValidator'
const itemsToRemove = ['admin']

export interface IUser {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  roles: string[]
}

export class User implements IUser {
  private static validator = new UserValidator()
  id: string
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
    value: IUser[K]
  ): string {
    return this.validator.validateField(field, value)
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
  findById(id: string): Promise<IUser | null>
  findAll(): Promise<IUser[]>
  create(asset: IUser): Promise<void>
  update(asset: IUser): Promise<void>
  delete(id: string): Promise<void>
}
