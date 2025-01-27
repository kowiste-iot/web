// application/userService.ts
import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { User, type IUser, type IUserRepository } from '../domain/user'
import { useUserStore } from '../stores/useUserStore'

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getUser(id: string): Promise<IUser | null> {
    try {
      const asset = await this.userRepository.findById(id)
      return asset
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch user: ${error.message}`
          : 'Failed to fetch user'
      this.notificationService.error(msg)
      return null
    }
  }

  async getUsers(): Promise<IUser[]> {
    try {
      return await this.userRepository.findAll()
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch users: ${error.message}`
          : 'Failed to fetch users'
      this.notificationService.error(msg)
      return []
    }
  }

  async createUser(data: IUser): Promise<boolean> {
    try {
      const errors = User.validate(data)

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const user = new User(data)
      await this.userRepository.create(user)
      this.notificationService.success('User created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid user data')
      } else {
        this.notificationService.error('Failed to create user')
      }
      return false
    }
  }

  async updateUser(data: IUser): Promise<boolean> {
    try {
      const errors = User.validate(data)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const existingUser = this.getUser(data.id)
      if (!existingUser) throw new Error('User not found')

      const updatedAsset = new User({ ...existingUser, ...data })

      await this.userRepository.update(updatedAsset)
      this.notificationService.success('User update successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid user data')
      } else {
        this.notificationService.error('Failed to update user')
      }
      return false
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id)
      this.notificationService.success('User delete successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete asset: ${error.message}`
          : 'Failed to delete asset'
      this.notificationService.error(msg)
    }
  }
  async updatePreferences(
    userId: string,
    preferences: IUser['preferences']
  ): Promise<boolean> {
    try {
      const user = useUserStore().userInfo
      if (!user) throw new Error('User not found')

      const updatedUser = new User({
        ...user,
        preferences,
      })

      const errors = User.validate(updatedUser)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      await this.userRepository.updatePreferences(userId, preferences)
      this.notificationService.success('Preferences updated successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid preferences data')
      } else {
        this.notificationService.error('Failed to update preferences')
      }
      return false
    }
  }

  async updateSettings(
    userId: string,
    settings: IUser['settings']
  ): Promise<boolean> {
    try {
      const user = useUserStore().userInfo
      if (!user) throw new Error('User not found')

      const updatedUser = new User({
        ...user,
        settings,
      })

      const errors = User.validate(updatedUser)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      await this.userRepository.updateSettings(userId, settings)
      this.notificationService.success('Settings updated successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid settings data')
      } else {
        this.notificationService.error('Failed to update settings')
      }
      return false
    }
  }
}
