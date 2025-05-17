// features/resource/stores/useResourceStore.ts
import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IScope } from '../domain/scope'
import { ScopeService } from '../application/scopeService'
import { ScopeRepository } from '../repository/scopeRepository'
import type { ID } from '@/features/shared/domain/id'

export const useScopeStore = defineStore('scopeStore', {
  state: () => ({
    scopes: [] as IScope[],
  }),
  getters: {
    getScopeById: (state) => {
      return (id: ID): IScope | undefined => {
        return state.scopes.find((scope) => scope.id === id)
      }
    },
    scopesMap(): Record<string, IScope> {
      return Object.fromEntries(this.scopes.map((scope) => [scope.name, scope]))
    },
  },
  actions: {
    async fetchScopes() {
      const scopeService = new ScopeService(
        new ScopeRepository(),
        new NotificationService(useNotificationStore())
      )
      this.scopes = await scopeService.getScopes()
    },
  },
})
