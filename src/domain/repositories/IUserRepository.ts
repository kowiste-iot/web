import type {  User } from '@/domain/models/User'
import type { CreateUserParams, UpdateUserParams } from '../models/type'

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(id: number): Promise<User | null>
  create(params: CreateUserParams): Promise<User>
  update(id: number, params: UpdateUserParams): Promise<User>
  delete(id: number): Promise<void>
}
