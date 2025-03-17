import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IAction } from '../domain/action'
import { ActionService } from '../application/actionService'
import { ActionRepository } from '../repository/actionRepository'
import type { ID } from '@/features/shared/domain/id'

export const useActionStore = defineStore('actionStore', {
  state: () => ({
    actions: [] as IAction[],
    currentAction: null as IAction | null,
  }),
  getters: {
    getActionById: (state) => {
      return (id: ID): IAction | undefined => {
        return state.actions.find((action) => action.id === id)
      }
    },
  },
  actions: {
    async fetchAction(id: ID) {
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
