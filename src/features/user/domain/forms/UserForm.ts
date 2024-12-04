import { FormBase } from '@/shared/forms/FormBase'
import { createUserSchema, type CreateUserParams, UserRole, type UserRoleType } from '../types'
import type { User } from '../User'

export class UserForm extends FormBase<typeof createUserSchema> {
  name: string = ''
  email: string = ''
  isActive: boolean = true
  role: UserRoleType = UserRole.USER

  constructor() {
    super(createUserSchema)
  }

  toCreateParams(): CreateUserParams | null {
    if (!this.validate()) {
      return null
    }

    return {
      name: this.name,
      email: this.email,
      isActive: this.isActive,
      role: this.role,
    }
  }

  fromUser(user: User): void {
    this.name = user.name
    this.email = user.email
    this.isActive = user.isActive
    this.role = user.role
  }
}
