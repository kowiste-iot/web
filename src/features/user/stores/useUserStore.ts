// stores/useUserStore.ts
import { defineStore } from 'pinia'
import { useAuthStore } from '@/plugins/security/store'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IUser } from '../domain/user'
import { UserService } from '../application/userService'
import { UserRepository } from '../repository/userRepository'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userInfo: null as IUser | null,
  }),

  getters: {
    getUserInitials(): string {
      if (!this.userInfo) return ''
      return (
        this.userInfo.firstName.charAt(0)?.toUpperCase() +
        this.userInfo.lastName.charAt(0)?.toUpperCase()
      )
    },

    getCurrentBranch(): string {
      return (
        this.userInfo?.settings.currentBranch ||
        this.userInfo?.branches[0] ||
        ''
      )
    },
  },

  actions: {
    syncWithAuth() {
      const authStore = useAuthStore()
      this.userInfo = authStore.getUserInfo
    },

    async updatePreferences(preferences: Partial<IUser['preferences']>) {
      if (!this.userInfo) return

      const userService = new UserService(
        new UserRepository(),
        new NotificationService(useNotificationStore())
      )

      const success = await userService.updatePreferences(this.userInfo.id, {
        ...this.userInfo.preferences,
        ...preferences,
      })

      if (success && this.userInfo) {
        this.userInfo = {
          ...this.userInfo,
          preferences: {
            ...this.userInfo.preferences,
            ...preferences,
          },
        }
      }
    },

    async updateSettings(settings: Partial<IUser['settings']>) {
      if (!this.userInfo) return

      // const userService = new UserService(
      //   new UserRepository(),
      //   new NotificationService(useNotificationStore())
      // )

      // const success = await userService.updateSettings(this.userInfo.id, {
      //   ...this.userInfo.settings,
      //   ...settings,
      // })
      const success=true

      if (success && this.userInfo) {
        this.userInfo = {
          ...this.userInfo,
          settings: {
            ...this.userInfo.settings,
            ...settings,
          },
        }
      }
    },
  },
})
