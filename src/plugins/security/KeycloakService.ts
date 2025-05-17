// plugins/security/KeycloakService.ts
import Keycloak from 'keycloak-js'
import { ref, computed, reactive } from 'vue'
import type { KeycloakConfig, Role, ResourcePermission } from './types'
import { type ISession, Session } from '@/features/session/domain/session'
import { useSessionStore } from '@/features/session/store/useSessionStore'
import { Environment } from '@/utils/enviroment/enviroment'
import { useTenantStore } from '@/features/tenant/stores/tenant'
import logger from '@/utils/log/logger'

export class KeycloakService {
  private keycloak: Keycloak | null = null
  private config: KeycloakConfig = {} as KeycloakConfig
  private refreshTimeout: number | null = null
  private readonly MIN_VALIDITY = 70 // Minimum token validity in seconds
  private readonly REFRESH_BUFFER = 30 // Seconds before expiration to refresh
  private initializationPromise: Promise<boolean> | null = null
  private initializing = false
  private directTokensSet = false // Flag to track if tokens were set directly

  // Reactive state
  private _token = ref<string | undefined>(undefined)
  private _isInitialized = ref<boolean>(false)
  private _isAuthenticated = ref<boolean>(false)
  private _roles = ref<Set<Role>>(new Set())
  private _resourcePermissions = ref<Map<string, Set<ResourcePermission>>>(
    new Map()
  )
  private _loginInProgress = ref<boolean>(false)
  private _authenticationState = reactive({
    lastAuthAttempt: 0,
    authAttemptCount: 0,
    maxAuthAttempts: 3,
    redirectAfterLogin: '',
  })

  // Expose reactive getters
  public get token() {
    return this._token.value
  }
  public get isInitialized() {
    return this._isInitialized.value
  }
  public get roles() {
    return this._roles.value
  }
  public get resourcePermissions() {
    return this._resourcePermissions.value
  }
  public get loginInProgress() {
    return this._loginInProgress.value
  }

  // Computed properties
  public readonly isAuthenticated = computed(() => {
    return this._isAuthenticated.value && !!this._token.value
  })

  public readonly hasRole = computed(() => {
    return (role: Role) => this._roles.value.has(role)
  })

  public readonly hasAnyRole = computed(() => {
    return (roles: Role[]) => roles.some((role) => this._roles.value.has(role))
  })

  public readonly hasAllRoles = computed(() => {
    return (roles: Role[]) => roles.every((role) => this._roles.value.has(role))
  })

  public readonly hasResourcePermission = computed(() => {
    return (resource: string, permission: ResourcePermission) => {
      const permissions = this._resourcePermissions.value.get(resource)
      return permissions?.has(permission) ?? false
    }
  })

  public readonly getUserInfo = computed((): ISession => {
    const tokenParsed = this.keycloak?.tokenParsed
    if (tokenParsed == undefined) {
      return {} as ISession
    }

    return new Session({
      id: tokenParsed.sub!,
      firstName: tokenParsed.given_name ?? '',
      lastName: tokenParsed.family_name ?? '',
      fullName: tokenParsed.name ?? 'Unknown User',
      email: tokenParsed.email ?? '',
      roles: Array.from(this._roles.value),
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
  })

  async updateRealm(newRealm: string): Promise<void> {
    if (!newRealm || newRealm === 'undefined') {
      throw new Error('Invalid realm configuration')
    }
    const windowsOrigin = window.location.origin
    logger.debug('Update realm keycloak:', windowsOrigin)

    try {
      // Clear the authentication state
      this._isAuthenticated.value = false
      this._authenticationState.authAttemptCount = 0
      this._authenticationState.lastAuthAttempt = 0

      if (this.keycloak?.authenticated) {
        this.clearRefreshTimeout()
        await this.keycloak.logout({
          redirectUri: windowsOrigin + '/tenant',
        })
      }

      // Import environment to get URL and clientID if not already in config
      const env = Environment.getInstance()

      // Use either existing config values or get them from environment
      const keycloakUrl = this.config.url || env.issuer
      const keycloakClientId = this.config.clientId || env.clientID

      if (!keycloakUrl || !keycloakClientId) {
        throw new Error(
          'Cannot determine Keycloak configuration: missing url or clientId'
        )
      }

      const newConfig: KeycloakConfig = {
        url: keycloakUrl,
        realm: newRealm,
        clientId: keycloakClientId,
        initOptions: {
          checkLoginIframe: false,
          pkceMethod: 'S256',
          enableLogging: true,
          onLoad: 'check-sso',
          silentCheckSsoFallback: false,
          flow: 'standard',
          redirectUri: windowsOrigin,
        },
      }

      logger.debug('Updating realm with complete config:', {
        url: newConfig.url,
        realm: newConfig.realm,
        clientId: newConfig.clientId,
      })

      await this.initialize(newConfig)
    } catch (error) {
      logger.debug('Failed to update realm:', error)
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
      logger.error('No token expiration found')
      return
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const expiryTime = this.keycloak.tokenParsed.exp
    const timeUntilExpiry = expiryTime - currentTime
    const refreshTime = Math.max(
      (timeUntilExpiry - this.REFRESH_BUFFER) * 1000,
      0
    )

    logger.debug(
      `Token expires in ${timeUntilExpiry} seconds. Scheduling refresh in ${
        refreshTime / 1000
      } seconds`
    )

    if (refreshTime > 0) {
      this.refreshTimeout = window.setTimeout(async () => {
        try {
          logger.debug('Executing scheduled token refresh')
          const refreshed = await this.keycloak?.updateToken(this.MIN_VALIDITY)

          if (refreshed) {
            logger.debug(
              'Token refreshed successfully',
              this.keycloak?.token?.slice(-5)
            )
            this._token.value = this.keycloak?.token
            this._isAuthenticated.value = true

            const sessionStore = useSessionStore()
            sessionStore.syncWithAuth()
            this.scheduleTokenRefresh()
          }
        } catch (error) {
          logger.error('Failed to refresh token:', error)
          // Don't automatically login, just mark as not authenticated
          this._isAuthenticated.value = false
          this._token.value = undefined
        }
      }, refreshTime)
    } else {
      logger.warn(
        'Token is already expired or close to expiry, refreshing immediately'
      )
      this.refreshToken()
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      // Check if we're using directly set tokens
      if (this.directTokensSet && this.keycloak?.refreshToken) {
        // If tokens were set directly and we have a refresh token,
        // we need to perform a manual token refresh using the refresh_token grant
        try {
          logger.debug('Refreshing directly set tokens')

          // We'll need to manually perform a token refresh since we bypassed login
          const result = await this.performManualTokenRefresh(
            this.keycloak.refreshToken
          )

          if (result.success) {
            logger.debug('Manually refreshed token successfully')
            this.keycloak.token = result.accessToken
            this.keycloak.refreshToken = result.refreshToken

            if (result.idToken) {
              this.keycloak.idToken = result.idToken
            }

            this._token.value = result.accessToken
            this._isAuthenticated.value = true

            const sessionStore = useSessionStore()
            sessionStore.syncWithAuth()
            this.scheduleTokenRefresh()
            return true
          } else {
            throw new Error(result.error || 'Token refresh failed')
          }
        } catch (error) {
          logger.error('Manual token refresh failed:', error)
          // Fall back to standard refresh if manual refresh fails
        }
      }

      // Standard token refresh
      const refreshed = await this.keycloak?.updateToken(this.MIN_VALIDITY)
      if (refreshed) {
        logger.debug('Token refreshed successfully')
        this._token.value = this.keycloak?.token
        this._isAuthenticated.value = true

        const sessionStore = useSessionStore()
        sessionStore.syncWithAuth()
        this.scheduleTokenRefresh()
        return true
      }
      return false
    } catch (error) {
      logger.error('Failed to refresh token:', error)
      this._isAuthenticated.value = false
      this._token.value = undefined
      return false
    }
  }

  /**
   * Manually refresh tokens using the refresh_token grant
   * This is used when tokens were set directly and need refreshing
   *
   * @param refreshToken The refresh token to use
   * @returns Object containing success status and new tokens
   */
  private async performManualTokenRefresh(refreshToken: string): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
    idToken?: string
    error?: string
  }> {
    try {
      if (!this.keycloak) {
        return { success: false, error: 'Keycloak not initialized' }
      }

      const url = `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`

      const params = new URLSearchParams()
      params.append('grant_type', 'refresh_token')
      params.append('refresh_token', refreshToken)
      if (this.keycloak.clientId) {
        params.append('client_id', this.keycloak.clientId)
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.error_description || 'Token refresh request failed',
        }
      }

      const data = await response.json()

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
      }
    } catch (error) {
      logger.error('Manual token refresh failed:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error during token refresh',
      }
    }
  }

  async initialize(config: KeycloakConfig): Promise<boolean> {
    // Prevent multiple simultaneous initialization attempts
    if (this.initializing) {
      logger.warn('Keycloak initialization already in progress')
      return this.initializationPromise as Promise<boolean>
    }

    if (!config.realm || config.realm === 'undefined') {
      logger.error('Invalid realm configuration')
      throw new Error('Invalid realm configuration')
    }

    this.initializing = true
    this.config = config
    this.clearRefreshTimeout()

    // Reset authentication state
    this._isAuthenticated.value = false
    this._token.value = undefined
    this._isInitialized.value = false

    this.initializationPromise = new Promise<boolean>(
      async (resolve, reject) => {
        try {
          logger.debug('Initializing Keycloak with config:', config)

          this.keycloak = new Keycloak({
            url: config.url,
            realm: config.realm,
            clientId: config.clientId,
          })

          // Set up event handlers before init
          this.keycloak.onAuthSuccess = () => {
            logger.debug('Keycloak auth success event')
            this._isAuthenticated.value = true
            this._token.value = this.keycloak?.token
            this.updateRoles()
            this.updateResourcePermissions()
            this.scheduleTokenRefresh()
          }

          this.keycloak.onAuthError = (error) => {
            logger.error('Keycloak auth error event:', error)
            this._isAuthenticated.value = false
          }

          this.keycloak.onAuthRefreshSuccess = () => {
            logger.debug('Keycloak auth refresh success event')
            this._token.value = this.keycloak?.token
          }

          this.keycloak.onAuthRefreshError = () => {
            logger.error('Keycloak auth refresh error event')
            this._isAuthenticated.value = false
          }

          this.keycloak.onTokenExpired = () => {
            logger.warn('Keycloak token expired event')
            this.refreshToken()
          }

          // Initialize Keycloak
          const authenticated = await this.keycloak.init({
            ...config.initOptions,
            onLoad: 'check-sso',
            silentCheckSsoFallback: false,
            checkLoginIframe: false,
          })

          logger.debug('Keycloak initialized, authenticated:', authenticated)

          this._isInitialized.value = true
          this._isAuthenticated.value = authenticated

          if (authenticated) {
            this._token.value = this.keycloak.token
            this.updateRoles()
            this.updateResourcePermissions()

            const sessionStore = useSessionStore()
            sessionStore.syncWithAuth()

            // Schedule token refresh
            this.scheduleTokenRefresh()
          }

          this.initializing = false
          resolve(authenticated)
        } catch (error) {
          logger.error('Failed to initialize Keycloak:', error)
          this._isInitialized.value = true
          this._isAuthenticated.value = false
          this.initializing = false
          reject(error)
        }
      }
    )

    return this.initializationPromise
  }

  updateRoles() {
    if (!this.keycloak) return
    const realmRoles = this.keycloak.realmAccess?.roles ?? []
    const clientRoles = Object.values(
      this.keycloak.resourceAccess ?? {}
    ).flatMap((access) => access.roles)

    const allRoles = [...realmRoles, ...clientRoles]

    this._roles.value = new Set(
      allRoles.filter((role): role is Role =>
        ['admin', 'supervisor', 'agent'].includes(role)
      )
    )
  }

  updateResourcePermissions() {
    if (!this.keycloak) return

    const resourceAccess = this.keycloak.tokenParsed?.resource_access ?? {}
    const newPermissions = new Map<string, Set<ResourcePermission>>()

    Object.entries(resourceAccess).forEach(
      ([resource, access]: [string, any]) => {
        const permissions = new Set<ResourcePermission>(
          access.roles
            .filter((role: string) => role.includes('-'))
            .map((role: string) => role.split('-')[1] as ResourcePermission)
        )

        if (permissions.size > 0) {
          newPermissions.set(resource, permissions)
        }
      }
    )

    this._resourcePermissions.value = newPermissions
  }

  getKeycloak(): Keycloak | null {
    return this.keycloak
  }

  async login(redirectUri?: string): Promise<void> {
    // Prevent login loops
    const now = Date.now()
    if (now - this._authenticationState.lastAuthAttempt < 2000) {
      this._authenticationState.authAttemptCount++

      if (
        this._authenticationState.authAttemptCount >
        this._authenticationState.maxAuthAttempts
      ) {
        logger.error(
          'Too many authentication attempts, redirecting to error page'
        )
        window.location.href = '/error'
        return
      }
    } else {
      // Reset counter if more than 2 seconds have passed
      this._authenticationState.authAttemptCount = 1
    }

    this._authenticationState.lastAuthAttempt = now

    if (this._loginInProgress.value) {
      logger.warn('Login already in progress')
      return
    }

    // Get the tenant store to access the current tenant email
    const tenantStore = useTenantStore()
    const currentTenantEmail = tenantStore.currentTenant?.email

    const windowsOrigin = window.location.origin

    if (this.keycloak) {
      try {
        this._loginInProgress.value = true
        this._authenticationState.redirectAfterLogin =
          redirectUri || windowsOrigin

        const loginOptions: Keycloak.KeycloakLoginOptions = {
          redirectUri: redirectUri || windowsOrigin,
        }

        // Add loginHint if email is set in the current tenant
        if (currentTenantEmail) {
          loginOptions.loginHint = currentTenantEmail
        }

        // Debug log to verify options
        logger.debug('Keycloak login options:', JSON.stringify(loginOptions))

        await this.keycloak.login(loginOptions)
      } catch (error) {
        logger.error('Login failed:', error)
      } finally {
        this._loginInProgress.value = false
      }
    }
  }

  async logout(redirectUri?: string): Promise<void> {
    const windowsOrigin = window.location.origin
    logger.debug('Logout keycloak', windowsOrigin)

    if (this.keycloak) {
      this.clearRefreshTimeout()
      this._isAuthenticated.value = false
      this._token.value = undefined

      const sessionStore = useSessionStore()
      sessionStore.$reset()

      await this.keycloak.logout({
        redirectUri: redirectUri || windowsOrigin,
      })
    }
  }

  getToken(): string | undefined {
    return this._token.value
  }

  async updateToken(minValidity: number = 300): Promise<boolean> {
    if (!this.keycloak) return false
    try {
      const updated = await this.keycloak.updateToken(minValidity)
      if (updated) {
        this._token.value = this.keycloak.token
        this._isAuthenticated.value = true
      }
      return updated
    } catch (error) {
      logger.error('Failed to update token:', error)
      this._isAuthenticated.value = false
      return false
    }
  }

  // Check if the current authentication state is valid
  async validateAuth(): Promise<boolean> {
    if (!this.keycloak) return false

    if (this.keycloak.authenticated && this._token.value) {
      try {
        // Try to update the token with minimal validity
        const updated = await this.keycloak.updateToken(5)
        if (updated) {
          this._token.value = this.keycloak.token
          this._isAuthenticated.value = true
          return true
        }
      } catch (error) {
        logger.error('Auth validation failed:', error)
      }
    }

    this._isAuthenticated.value = false
    return false
  }

  /**
   * Set authentication tokens directly without requiring a login flow
   * Useful for onboarding flows where tokens are obtained through another process
   *
   * @param accessToken The Keycloak access token
   * @param refreshToken The Keycloak refresh token (optional but recommended)
   * @param idToken The Keycloak ID token (optional)
   * @param expiresIn Token expiration in seconds (default: 300 seconds)
   * @returns True if tokens were successfully set
   */
  async setTokensDirectly(
    accessToken: string,
    refreshToken?: string,
    idToken?: string,
    expiresIn: number = 300
  ): Promise<boolean> {
    if (!this.keycloak) {
      logger.error('Cannot set tokens: Keycloak not initialized')
      return false
    }

    try {
      logger.debug('Setting tokens directly')

      // Store original tokens to restore in case of failure
      const originalToken = this.keycloak.token
      const originalRefreshToken = this.keycloak.refreshToken
      const originalIdToken = this.keycloak.idToken
      const originalAuthenticated = this.keycloak.authenticated

      // Set the tokens directly on the Keycloak instance
      this.keycloak.token = accessToken
      if (refreshToken) {
        this.keycloak.refreshToken = refreshToken
      }
      if (idToken) {
        this.keycloak.idToken = idToken
      }

      // Set token expiration
      const now = Math.floor(Date.now() / 1000)
      this.keycloak.tokenParsed = this.keycloak.tokenParsed || ({} as any)
      if (this.keycloak?.tokenParsed?.exp) {
        this.keycloak.tokenParsed.exp = now + expiresIn
      }

      // Try to update session state
      try {
        // Mark as authenticated
        this.keycloak.authenticated = true
        this._isAuthenticated.value = true
        this._token.value = accessToken

        // Parse the token to get user info
        if (this.keycloak.tokenParsed) {
          // Try to decode the JWT to extract information
          try {
            const tokenData = this.parseJwt(accessToken)
            this.keycloak.tokenParsed = tokenData

            // Update roles based on token content
            this.updateRoles()
            this.updateResourcePermissions()
          } catch (parseError) {
            logger.warn('Could not parse JWT token:', parseError)
          }
        }

        // Sync with session store
        const sessionStore = useSessionStore()
        sessionStore.syncWithAuth()

        // Schedule token refresh
        this.directTokensSet = true
        this.scheduleTokenRefresh()

        logger.debug('Tokens set successfully')
        return true
      } catch (error) {
        // Restore original state in case of error
        logger.error('Error setting tokens directly:', error)
        this.keycloak.token = originalToken
        this.keycloak.refreshToken = originalRefreshToken
        this.keycloak.idToken = originalIdToken
        this.keycloak.authenticated = originalAuthenticated
        if (originalAuthenticated) {
          this._isAuthenticated.value = originalAuthenticated
        }
        this._token.value = originalToken
        return false
      }
    } catch (error) {
      logger.error('Failed to set tokens directly:', error)
      return false
    }
  }

  /**
   * Helper method to parse a JWT token
   * @param token The JWT token to parse
   * @returns Parsed token payload as an object
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) {
        throw new Error('Invalid JWT format')
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )

      return JSON.parse(jsonPayload)
    } catch (error) {
      logger.error('Error parsing JWT token:', error)
      throw error
    }
  }

  /**
   * Simulate a successful login with provided tokens
   * This is useful for seamless onboarding where you want to skip the Keycloak login page
   *
   * @param realm The realm to use
   * @param accessToken The Keycloak access token
   * @param refreshToken The Keycloak refresh token
   * @param idToken The Keycloak ID token (optional)
   * @returns True if the operation succeeded
   */
  async loginWithTokens(
    realm: string,
    accessToken: string,
    refreshToken: string,
    idToken?: string
  ): Promise<boolean> {
    try {
      // First ensure Keycloak is initialized with the correct realm
      const env = Environment.getInstance()
      const keycloakUrl = this.config.url || env.issuer
      const keycloakClientId = this.config.clientId || env.clientID

      if (!keycloakUrl || !keycloakClientId) {
        throw new Error('Cannot determine Keycloak configuration')
      }

      const config: KeycloakConfig = {
        url: keycloakUrl,
        realm: realm,
        clientId: keycloakClientId,
        initOptions: {
          checkLoginIframe: false,
          pkceMethod: 'S256',
          enableLogging: true,
          onLoad: 'check-sso',
          silentCheckSsoFallback: false,
          flow: 'standard',
          redirectUri: window.location.origin,
        },
      }

      // Initialize Keycloak with the specified realm
      logger.debug('Initializing Keycloak for token-based login')
      await this.initialize(config)

      // Then set the tokens directly
      const result = await this.setTokensDirectly(
        accessToken,
        refreshToken,
        idToken
      )

      if (result) {
        logger.debug('Token-based login successful')
      } else {
        logger.error('Token-based login failed')
      }

      return result
    } catch (error) {
      logger.error('Failed to login with tokens:', error)
      return false
    }
  }
}

export const keycloakService = new KeycloakService()
