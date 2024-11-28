import { BaseModel } from '@/shared/models/BaseModel'
import { type UserRoleType,type CreateUserParams, createUserSchema, UserRole } from './types'

export class User extends BaseModel {
  constructor(
    id: number,
    public name: string,
    public email: string,
    public isActive: boolean,
    public role: UserRoleType,
    public createdAt: Date
  ) {
    super(id)
  }

  public static create(
    params: CreateUserParams & { id?: number; createdAt?: Date }
  ): User {
    const validatedData = createUserSchema.parse(params)

    return new User(
      params.id ?? 0,
      validatedData.name,
      validatedData.email,
      validatedData.isActive,
      validatedData.role,
      params.createdAt ?? new Date()
    )
  }

  public deactivate(): void {
    this.isActive = false
  }

  public canAccessAdmin(): boolean {
    return this.role === UserRole.ADMIN && this.isActive
  }
}
