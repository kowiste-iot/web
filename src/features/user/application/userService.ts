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
