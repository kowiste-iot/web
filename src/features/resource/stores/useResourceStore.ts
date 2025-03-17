import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { IResource } from '../domain/resource'
import { ResourceService } from '../application/resourceService'
import { ResourceRepository } from '../repository/resourceRepository'
import type { ID } from '@/features/shared/domain/id'

export const useResourceStore = defineStore('resourceStore', {
  state: () => ({
    resources: [] as IResource[],
    currentResource: null as IResource | null,
  }),
  getters: {
    getResourceById: (state) => {
      return (id: ID): IResource | undefined => {
        return state.resources.find((resource) => resource.id === id)
      }
    },
  },
  actions: {
    async fetchResource(id: ID) {
      const resourceService = new ResourceService(
        new ResourceRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentResource = await resourceService.getResource(id)
    },
    async fetchResources() {
      const resourceService = new ResourceService(
        new ResourceRepository(),
        new NotificationService(useNotificationStore())
      )
      this.resources = await resourceService.getResources()
    },
    async createResource(data: IResource) {
      const resourceService = new ResourceService(
        new ResourceRepository(),
        new NotificationService(useNotificationStore())
      )
      const success = await resourceService.createResource(data)
      if (success) {
        await this.fetchResources()
      }
      return success
    },
    async updateResource(data: IResource) {
      const resourceService = new ResourceService(
        new ResourceRepository(),
        new NotificationService(useNotificationStore())
      )
      const success = await resourceService.updateResource(data)
      if (success) {
        await this.fetchResources()
      }
      return success
    },
    async deleteResource(id: ID) {
      const resourceService = new ResourceService(
        new ResourceRepository(),
        new NotificationService(useNotificationStore())
      )
      await resourceService.deleteResource(id)
      await this.fetchResources()
    },
  },
})
