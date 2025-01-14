import { defineStore } from 'pinia'
import type { INotification } from '../domain/notification'


interface NotificationState {
  notifications: INotification[]
}

export type NotificationStore = ReturnType<typeof useNotificationStore>

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
  }),

  actions: {
    addNotification(notification: INotification) {
      this.notifications.push(notification)
      if (notification.duration) {
        setTimeout(() => {
          this.removeNotification(notification.id)
        }, notification.duration)
      }
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },
  },
})
