// plugins/security/KeycloakService.ts
import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from './types'
import { useAuthStore } from './store'

export class KeycloakService {
  private keycloak: Keycloak | null = null

  async initialize(config: KeycloakConfig): Promise<void> {
    if (!config.realm || config.realm === 'undefined') {
      throw new Error('Invalid realm configuration')
    }

    this.keycloak = new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
    })

    try {
      const authenticated = await this.keycloak.init({
        ...config.initOptions,
        onLoad: 'check-sso',
        silentCheckSsoFallback: false,
        checkLoginIframe: false,
      })

      const authStore = useAuthStore()
      authStore.setKeycloak(this.keycloak)

      if (!authenticated && window.location.pathname !== '/tenant') {
        await this.keycloak.login({
          redirectUri: window.location.origin + window.location.pathname,
        })
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error)
      throw error
    }
  }

  getKeycloak(): Keycloak | null {
    return this.keycloak
  }

  async updateRealm(newRealm: string): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.logout() // Logout from current realm

      const newConfig: KeycloakConfig = {
        url: this.keycloak.authServerUrl!,
        realm: newRealm,
        clientId: this.keycloak.clientId!,
        initOptions: {
          checkLoginIframe: false,
          pkceMethod: 'S256',
          enableLogging: true,
          onLoad: 'check-sso',
          silentCheckSsoFallback: false,
          flow: 'standard',
        },
      }

      await this.initialize(newConfig)
    }
  }

  async login(redirectUri?: string): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.login({
        redirectUri: redirectUri || window.location.origin,
      })
    }
  }

  async logout(redirectUri?: string): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.logout({
        redirectUri: redirectUri || window.location.origin,
      })
    }
  }

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated ?? false
  }

  getToken(): string | undefined {
    return this.keycloak?.token
  }
}

export const keycloakService = new KeycloakService()
