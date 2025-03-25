import type { INotificationService } from '@/features/notification/application/notificationService'
import { User, type IUser, type IUserRepository } from '../domain/user'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getUser(id: ID): Promise<IUser | null> {
    try {
      const asset = await this.userRepository.findById(id)
      return asset
    } catch (error) {
      const errors = ValidationError.fromRequest<IUser>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch user: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getUsers(): Promise<IUser[]> {
    try {
      return await this.userRepository.findAll()
    } catch (error) {
      const errors = ValidationError.fromRequest<IUser>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch users: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createUser(data: IUser): Promise<ValidationError<IUser> | null> {
    try {
      const errors = User.validate(data)
      if (errors.hasErrors()) {
        return errors
      }

      const user = new User(data)
      await this.userRepository.create(user)
      this.notificationService.success('User created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IUser>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create user: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateUser(data: IUser): Promise<ValidationError<IUser> | null> {
    try {
      const errors = User.validate(data)
      if (errors.hasErrors()) {
        return errors
      }

      const existingUser = this.getUser(data.id)
      if (!existingUser) throw new Error('User not found')

      const updatedUser = new User({ ...existingUser, ...data })

      await this.userRepository.update(updatedUser)
      this.notificationService.success('User update successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IUser>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update user: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteUser(id: ID): Promise<void> {
    try {
      await this.userRepository.delete(id)
      this.notificationService.success('User delete successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IUser>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete user: ' + errors.getError('gError')!
      )
      return
    }
  }
}
