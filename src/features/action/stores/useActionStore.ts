import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IAction } from '../domain/action'
import { ActionService } from '../application/actionService'
import { ActionRepository } from '../repository/actionRepository'

export const useActionStore = defineStore('actionStore', {
  state: () => ({
    actions: [] as IAction[],
    currentAction: null as IAction | null,
  }),

  actions: {
    async fetchAction(id: string) {
      const actionService = new ActionService(
        new ActionRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentAction = await actionService.getAction(id)
    },
    async fetchActions() {
      const actionService = new ActionService(
        new ActionRepository(),
        new NotificationService(useNotificationStore())
      )
      this.actions = await actionService.getActions()
    },
  },
})
