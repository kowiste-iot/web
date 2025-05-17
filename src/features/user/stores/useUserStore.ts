// stores/useUserStore.ts
import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IUser } from '../domain/user'
import { UserService } from '../application/userService'
import { UserRepository } from '../repository/userRepository'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [] as IUser[],
    currentUser: null as IUser | null,
  }),

  actions: {
    async fetchUsers() {
      const userService = new UserService(
        new UserRepository(),
        new NotificationService(useNotificationStore())
      )
      this.users = await userService.getUsers()
    },
  },
})
