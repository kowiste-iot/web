import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'
import type { Role, ResourcePermission } from './types'
import { type ISession, Session } from '@/features/session/domain/session'

interface AuthState {
  keycloak?: Keycloak
  token?: string
  isInitialized: boolean
  roles: Set<Role>
  resourcePermissions: Map<string, Set<ResourcePermission>>
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    keycloak: undefined,
    token: undefined,
    isInitialized: false,
    roles: new Set(),
    resourcePermissions: new Map(),
  }),

  getters: {
    isAuthenticated(): boolean {
      return this.keycloak?.authenticated ?? false
    },

    hasRole(): (role: Role) => boolean {
      return (role: Role) => this.roles.has(role)
    },

    hasAnyRole(): (roles: Role[]) => boolean {
      return (roles: Role[]) => roles.some((role) => this.roles.has(role))
    },

    hasAllRoles(): (roles: Role[]) => boolean {
      return (roles: Role[]) => roles.every((role) => this.roles.has(role))
    },

    hasResourcePermission(): (
      resource: string,
      permission: ResourcePermission
    ) => boolean {
      return (resource: string, permission: ResourcePermission) => {
        const permissions = this.resourcePermissions.get(resource)
        return permissions?.has(permission) ?? false
      }
    },

    getUserInfo(): ISession {
      const tokenParsed = this.keycloak?.tokenParsed
      if (tokenParsed == undefined) {
        return {} as ISession
      }

      const temp = new Session({
        id: tokenParsed.sub!,
        firstName: tokenParsed.given_name ?? '',
        lastName: tokenParsed.family_name ?? '',
        fullName: tokenParsed.name ?? 'Unknown User',
        email: tokenParsed.email ?? '',
        roles: Array.from(this.roles),
        branches: Array.isArray(tokenParsed.branch)
          ? Array.from(tokenParsed.branch)
          : ['ND'],
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
          },
        },
        settings: {
          defaultView: 'dashboard',
          timezone: 'UTC',
          currentBranch: undefined,
        },
      })
      return temp
    },
  },

  actions: {
    setKeycloak(keycloak: Keycloak) {
      // console.log('update  kc', keycloak.token?.slice(-5))
      this.keycloak = keycloak
      this.token = keycloak.token
      this.isInitialized = true
      this.updateRoles()
      this.updateResourcePermissions()
    },

    updateRoles() {
      if (!this.keycloak) return
      const realmRoles = this.keycloak.realmAccess?.roles ?? []
      const clientRoles = Object.values(
        this.keycloak.resourceAccess ?? {}
      ).flatMap((access) => access.roles)

      const allRoles = [...realmRoles, ...clientRoles]

      this.roles = new Set(
        allRoles.filter((role): role is Role =>
          ['admin', 'supervisor', 'agent'].includes(role)
        )
      )
    },

    updateResourcePermissions() {
      if (!this.keycloak) return

      const resourceAccess = this.keycloak.tokenParsed?.resource_access ?? {}

      this.resourcePermissions.clear()

      Object.entries(resourceAccess).forEach(
        ([resource, access]: [string, any]) => {
          const permissions = new Set<ResourcePermission>(
            access.roles
              .filter((role: string) => role.includes('-'))
              .map((role: string) => role.split('-')[1] as ResourcePermission)
          )

          if (permissions.size > 0) {
            this.resourcePermissions.set(resource, permissions)
          }
        }
      )
    },
    //TODO: maybe remove this and use keycloak service
    async login(redirectUri?: string): Promise<void> {
      if (this.isAuthenticated) return

      if (this.keycloak) {
        try {
          await this.keycloak.login({
            redirectUri: redirectUri ?? window.location.origin,
          })
        } catch (error) {
          console.error('Login failed:', error)
          throw error
        }
      }
    },
    //TODO: maybe remove this and use keycloak service
    async logout() {
      if (!this.isAuthenticated) return
      await this.keycloak?.logout({
        redirectUri: window.location.origin,
      })
    },

    async updateToken(minValidity: number = 300): Promise<boolean> {
      if (!this.keycloak) return false
      try {
        this.token = undefined // Reset token before refresh
        const updated = await this.keycloak.updateToken(minValidity)
        if (updated) {
          this.token = this.keycloak.token
        }
        return updated
      } catch {
        await this.login()
        return false
      }
    },
  },
})
