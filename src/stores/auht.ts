import { defineStore } from 'pinia'
import Keycloak, { type KeycloakResourceAccess } from 'keycloak-js'
interface State {
  keycloak: Keycloak | undefined
  authenticated: boolean
  userProfile: any | undefined
  userRoles: string[]
  resourcePermissions: KeycloakResourceAccess | undefined
}
export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    keycloak: undefined,
    authenticated: false,
    userProfile: null,
    userRoles: [],
    resourcePermissions: undefined,
  }),

  actions: {
    async initializeKeycloak() {
      const keycloakConfig = {
        url: import.meta.env.VITE_KEYCLOAK_URL,
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
      }

      this.keycloak = new Keycloak(keycloakConfig)

      try {
        const authenticated = await this.keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        })

        this.authenticated = authenticated

        if (authenticated) {
          await this.loadUserProfile()
          await this.loadResourcePermissions()
          this.startTokenRefreshInterval()
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error)
      }
    },

    async loadUserProfile() {
      try {
        this.userProfile = await this.keycloak?.loadUserProfile()
        this.userRoles = this.keycloak?.realmAccess?.roles || []
      } catch (error) {
        console.error('Failed to load user profile:', error)
      }
    },

    async loadResourcePermissions() {
      try {
        const authorizationEnabled =
          this.keycloak?.authServerUrl?.includes('/auth')
        if (authorizationEnabled) {
          const permissions = await this.keycloak?.resourceAccess
          this.resourcePermissions = permissions
        }
      } catch (error) {
        console.error('Failed to load resource permissions:', error)
      }
    },

    startTokenRefreshInterval() {
      setInterval(() => {
        this.keycloak?.updateToken(70).catch(() => {
          console.error('Failed to refresh token')
        })
      }, 60000)
    },

    async login() {
      try {
        await this.keycloak?.login()
      } catch (error) {
        console.error('Login failed:', error)
      }
    },

    async logout() {
      try {
        await this.keycloak?.logout()
        this.authenticated = false
        this.userProfile = null
        this.userRoles = []
        this.resourcePermissions =undefined
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },

    hasRole(role: string) {
      return this.userRoles.includes(role)
    },

    // hasResourcePermission(resource, scope) {
    //   return this.resourcePermissions.some(
    //     (permission) =>
    //       permission.rsname === resource && permission.scopes.includes(scope)
    //   )
    // },
  },
})
