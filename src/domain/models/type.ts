export interface CreateUserParams {
  name: string
  email: string
  isActive: boolean
  role: string
}

export interface UpdateUserParams extends Partial<CreateUserParams> {}
