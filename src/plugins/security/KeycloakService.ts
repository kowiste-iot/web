// plugins/security/KeycloakService.ts
import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from './types'
import { useAuthStore } from './store'
import { useSessionStore } from '@/features/session/store/useSessionStore'

export class KeycloakService {
  private keycloak: Keycloak | null = null
  private config: KeycloakConfig = {} as KeycloakConfig
  private refreshTimeout: number | null = null
  private readonly MIN_VALIDITY = 70 // Minimum token validity in seconds
  private readonly REFRESH_BUFFER = 30 // Seconds before expiration to refresh

  async updateRealm(newRealm: string): Promise<void> {
    if (!newRealm || newRealm === 'undefined') {
      throw new Error('Invalid realm configuration')
    }
    const windowsOrigin = window.location.origin
    console.log('update realm keycloak', windowsOrigin)

    try {
      if (this.keycloak?.authenticated) {
        this.clearRefreshTimeout()
        await this.keycloak.logout({
          redirectUri: windowsOrigin + '/tenant',
        })
      }

      const newConfig: KeycloakConfig = {
        url: this.config.url,
        realm: newRealm,
        clientId: this.config.clientId,
        initOptions: {
          checkLoginIframe: false,
          pkceMethod: 'S256',
          enableLogging: true,
          onLoad: 'login-required',
          silentCheckSsoFallback: false,
          flow: 'standard',
          redirectUri: windowsOrigin,
        },
      }

      await this.initialize(newConfig)
    } catch (error) {
      console.error('Failed to update realm:', error)
      throw error
    }
  }

  private clearRefreshTimeout(): void {
    if (this.refreshTimeout) {
      window.clearTimeout(this.refreshTimeout)
      this.refreshTimeout = null
    }
  }

  private scheduleTokenRefresh(): void {
    this.clearRefreshTimeout()

    if (!this.keycloak?.tokenParsed?.exp) {
      console.error('No token expiration found')
      return
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const expiryTime = this.keycloak.tokenParsed.exp
    const timeUntilExpiry = expiryTime - currentTime
    const refreshTime = (timeUntilExpiry - this.REFRESH_BUFFER) * 1000

    console.log(
      `Token expires in ${timeUntilExpiry} seconds. Scheduling refresh in ${
        refreshTime / 1000
      } seconds`
    )

    if (refreshTime > 0) {
      this.refreshTimeout = window.setTimeout(async () => {
        try {
          console.log('Executing scheduled token refresh')
          const refreshed = await this.keycloak?.updateToken(this.MIN_VALIDITY)

          if (refreshed) {
            console.log(
              'Token refreshed successfully',
              this.keycloak?.token?.slice(-5)
            )
            const sessionStore = useSessionStore()
            const authStore = useAuthStore()

            // Update auth store with the refreshed keycloak instance
            authStore.setKeycloak(this.keycloak!)
            sessionStore.syncWithAuth()
            this.scheduleTokenRefresh()
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          await this.login()
        }
      }, refreshTime)
    } else {
      console.warn(
        'Token is already expired or close to expiry, refreshing immediately'
      )
      this.refreshToken()
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const refreshed = await this.keycloak?.updateToken(this.MIN_VALIDITY)
      if (refreshed) {
        console.log('Token refreshed successfully')
        const sessionStore = useSessionStore()
        const authStore = useAuthStore()
        authStore.setKeycloak(this.keycloak!)
        sessionStore.syncWithAuth()
        this.scheduleTokenRefresh()
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      await this.login()
    }
  }

  async initialize(config: KeycloakConfig): Promise<void> {
    if (!config.realm || config.realm === 'undefined') {
      throw new Error('Invalid realm configuration')
    }
    this.config = config
    this.clearRefreshTimeout()

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
      const sessionStore = useSessionStore()

      authStore.setKeycloak(this.keycloak)
      sessionStore.syncWithAuth()

      // Schedule initial token refresh
      this.scheduleTokenRefresh()

      // Keep onTokenExpired as a backup
      this.keycloak.onTokenExpired = () => {
        console.log('Token expired event triggered')
        this.refreshToken()
      }

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
    const windowsOrigin = window.location.origin
    console.log('login keycloak', windowsOrigin)
    if (this.keycloak) {
      await this.keycloak.login({
        redirectUri: redirectUri || windowsOrigin,
      })
    }
  }

  async logout(redirectUri?: string): Promise<void> {
    const windowsOrigin = window.location.origin
    console.log('logout keycloak', windowsOrigin)
    if (this.keycloak) {
      this.clearRefreshTimeout()
      const sessionStore = useSessionStore()
      sessionStore.$reset()
      await this.keycloak.logout({
        redirectUri: redirectUri || windowsOrigin,
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
