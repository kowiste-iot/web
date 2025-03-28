import type { App } from 'vue'
import type { KeycloakConfig } from './types'
import { keycloakService } from './KeycloakService'
import { useTenantStore } from '@/features/tenant/stores/tenant'
import type { Router } from 'vue-router'

export const KeycloakPlugin = {
  install: async (app: App, options: KeycloakConfig, router?: Router) => {
    const tenantStore = useTenantStore()
    await tenantStore.loadTenants()

    // Skip Keycloak initialization if no tenant
    const currentTenant = tenantStore.getCurrentTenant
    if (!currentTenant) {
      console.log('No tenant selected, skipping Keycloak initialization')
      return
    }

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
        redirectUri: window.location.href,
      },
    }

    try {
      await keycloakService.initialize(keycloakConfig)
      app.config.globalProperties.$keycloak = keycloakService.getKeycloak()
    } catch (error) {
      console.error('Keycloak initialization failed:', error)
      if (router) {
        router.push({ name: 'error' })
      }
    }
  },
}
