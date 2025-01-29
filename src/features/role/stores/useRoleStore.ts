// features/role/stores/useRoleStore.ts
import { defineStore } from 'pinia'

import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import { adminRole, type IRole } from '../domain/role'
import { RoleService } from '../application/roleService'
import { RoleRepository } from '../repository/roleRepository'

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    roles: [] as IRole[],
    currentRole: null as IRole | null,
  }),
  getters: {
    getRolesNonAdmin(): IRole[] {
      return this.roles.filter((role)=>role.name !=adminRole)
    },
    getRoleById: (state) => {
      return (id: string): IRole | undefined => {
        return state.roles.find((role) => role.id === id)
      }
    },
  },
  actions: {
    async fetchRole(id: string) {
      const roleService = new RoleService(
        new RoleRepository(),
        new NotificationService(useNotificationStore())
      )
      this.currentRole = await roleService.getRole(id)
    },
    async fetchRoles() {
      const roleService = new RoleService(
        new RoleRepository(),
        new NotificationService(useNotificationStore())
      )
      this.roles = await roleService.getRoles()
    },
  },
})
