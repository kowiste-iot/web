import { type IBaseRepository } from '@/shared/repositories/IBaseRepository'
import { User } from './User'
import { type CreateUserParams,type UpdateUserParams } from './types'

export interface IUserRepository
  extends IBaseRepository<User, CreateUserParams, UpdateUserParams> {}
