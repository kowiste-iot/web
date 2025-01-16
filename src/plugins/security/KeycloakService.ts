// plugins/security/KeycloakService.ts
import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from './types'
import { useAuthStore } from './store'

export class KeycloakService {
  private keycloak: Keycloak | null = null

  async updateRealm(newRealm: string): Promise<void> {
    if (!newRealm || newRealm === 'undefined') {
      throw new Error('Invalid realm configuration')
    }

    try {
      // If already initialized, logout first
      if (this.keycloak?.authenticated) {
        await this.keycloak.logout({
          redirectUri: window.location.origin + '/tenant',
        })
      }

      const newConfig: KeycloakConfig = {
        url: 'http://localhost:7080/auth', // Your Keycloak URL
        realm: newRealm,
        clientId: 'vue-client',
        initOptions: {
          checkLoginIframe: false,
          pkceMethod: 'S256',
          enableLogging: true,
          onLoad: 'login-required', // Force login
          silentCheckSsoFallback: false,
          flow: 'standard',
          redirectUri: window.location.origin,
        },
      }

      await this.initialize(newConfig)
    } catch (error) {
      console.error('Failed to update realm:', error)
      throw error
    }
  }

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
        onLoad: 'login-required',
        silentCheckSsoFallback: false,
        checkLoginIframe: false,
      })

      const authStore = useAuthStore()
      authStore.setKeycloak(this.keycloak)

      if (!authenticated) {
        await this.keycloak.login({
          redirectUri: window.location.origin,
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
