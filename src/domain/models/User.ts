import {
  createUserSchema,
  updateUserSchema,
  type CreateUserParams,
  type UpdateUserParams,
} from '../validation/userSchema'

export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public createdAt: Date,
    public isActive: boolean,
    public role: string
  ) {}

  public static create(
    params: CreateUserParams & { id?: number; createdAt?: Date }
  ): User {
    const validatedData = createUserSchema.parse({
      name: params.name,
      email: params.email,
      isActive: params.isActive,
      role: params.role,
    })

    return new User(
      params.id ?? 0,
      validatedData.name,
      validatedData.email,
      params.createdAt ?? new Date(),
      validatedData.isActive,
      validatedData.role
    )
  }

  public update(params: UpdateUserParams): void {
    const validatedData = updateUserSchema.parse(params)

    if (validatedData.name !== undefined) {
      this.name = validatedData.name
    }
    if (validatedData.email !== undefined) {
      this.email = validatedData.email
    }
    if (validatedData.isActive !== undefined) {
      this.isActive = validatedData.isActive
    }
    if (validatedData.role !== undefined) {
      this.role = validatedData.role
    }
  }

  public deactivate(): void {
    this.isActive = false
  }

  public updateName(newName: string): void {
    if (newName.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long')
    }
    this.name = newName.trim()
  }

  // Domain logic methods
  public canAccessAdmin(): boolean {
    return this.role === 'admin' && this.isActive
  }
}
