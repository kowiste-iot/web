// stores/useUserStore.ts
import { defineStore } from 'pinia'
import { useAuthStore } from '@/plugins/security/store'
import type { ISession } from '../domain/session'

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    userInfo: null as ISession | null,
    openTour: false,
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
    async updateSettings(settings: Partial<ISession['settings']>) {
      if (!this.userInfo) return
      const success = true

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
