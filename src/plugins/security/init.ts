import type { App } from 'vue'
import type { KeycloakConfig } from './types'
import { keycloakService } from './KeycloakService'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/features/tenant/stores/tenant'

export const KeycloakPlugin = {
  install: async (app: App, options: KeycloakConfig) => {
    const tenantStore = useTenantStore()
    tenantStore.loadTenants()

    // Skip Keycloak initialization if no tenant
    const currentTenant = tenantStore.getCurrentTenant
    if (!currentTenant) {
      console.log('No tenant selected, skipping Keycloak initialization')
      return
    }

    const windowsOrigin = window.location.origin
    console.log('init keycloak', windowsOrigin)

    // Initialize with current tenant
    const keycloakConfig: KeycloakConfig = {
      ...options,
      realm: currentTenant.id,
      initOptions: {
        ...options.initOptions,
        checkLoginIframe: false, // Disable iframe checks
        pkceMethod: 'S256',
        enableLogging: true,
        onLoad: 'check-sso',
        silentCheckSsoFallback: false, // Disable fallback to avoid iframe issues
        redirectUri: windowsOrigin,
      },
    }

    try {
      await keycloakService.initialize(keycloakConfig)
      app.config.globalProperties.$keycloak = keycloakService.getKeycloak()
    } catch (error) {
      console.error('Keycloak initialization failed:', error)
      const router = useRouter()
      router.push({ name: 'error' })
    }
  },
}
