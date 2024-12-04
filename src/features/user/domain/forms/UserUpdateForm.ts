import { FormBase } from '@/shared/forms/FormBase'
import { updateUserSchema, type UpdateUserParams, type UserRoleType } from '../types'
import type { User } from '../User'

export class UserUpdateForm extends FormBase<typeof updateUserSchema> {
  name?: string
  email?: string
  isActive?: boolean
  role?: UserRoleType

  constructor() {
    super(updateUserSchema)
  }

  toUpdateParams(): UpdateUserParams | null {
    if (!this.validate()) {
      return null
    }

    const params: UpdateUserParams = {}
    if (this.name !== undefined) params.name = this.name
    if (this.email !== undefined) params.email = this.email
    if (this.isActive !== undefined) params.isActive = this.isActive
    if (this.role !== undefined) params.role = this.role

    return params
  }

  fromUser(user: User): void {
    this.name = user.name
    this.email = user.email
    this.isActive = user.isActive
    this.role = user.role
  }
}
