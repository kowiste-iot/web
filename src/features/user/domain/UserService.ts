import { User } from './User'
import type { IUserRepository } from './IUserRepository'
import type { CreateUserParams, UpdateUserParams } from './types'
import { createUserSchema, updateUserSchema } from './types'

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async createUser(params: CreateUserParams): Promise<User> {
    // Validate at service level
    const validatedData = createUserSchema.parse(params)
    return this.userRepository.create(validatedData)
  }

  async updateUser(id: number, params: UpdateUserParams): Promise<User> {
    // Validate at service level
    const validatedData = updateUserSchema.parse(params)

    // Check if user exists
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`)
    }

    return this.userRepository.update(id, validatedData)
  }

  async deleteUser(id: number): Promise<void> {
    // Check if user exists before deletion
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`)
    }

    return this.userRepository.delete(id)
  }

  // Additional business logic methods
  async deactivateUser(id: number): Promise<User> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error(`User with id ${id} not found`)
    }

    user.deactivate()
    return this.updateUser(id, { isActive: false })
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const users = await this.getUsers()
    return users.filter((user) => user.role === role)
  }

  async getActiveUsers(): Promise<User[]> {
    const users = await this.getUsers()
    return users.filter((user) => user.isActive)
  }

  async getAdminUsers(): Promise<User[]> {
    const users = await this.getUsers()
    return users.filter((user) => user.canAccessAdmin())
  }
}
