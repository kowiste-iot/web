import {
  createUserSchema,
  updateUserSchema,
} from '../validation/userSchema'

import type { User } from '../models/User'
import type { IUserRepository } from '../repositories/IUserRepository'
import type { CreateUserParams, UpdateUserParams } from '../models/type'

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async createUser(params: CreateUserParams): Promise<User> {
    // Validate at service level before creating
    const validatedData = createUserSchema.parse(params)
    return this.userRepository.create(validatedData)
  }

  async updateUser(id: number, params: UpdateUserParams): Promise<User> {
    // Validate at service level before updating
    const validatedData = updateUserSchema.parse(params)
    return this.userRepository.update(id, validatedData)
  }

  async deleteUser(id: number): Promise<void> {
    return this.userRepository.delete(id)
  }
}
