// plugins/security/init.ts
import type { App } from 'vue'
import type { KeycloakConfig } from './types'
import { keycloakService } from './KeycloakService'
import { useTenantStore } from '@/features/tenant/stores/tenant'
import type { Router } from 'vue-router'
import logger from '@/utils/log/logger'

export const KeycloakPlugin = {
  install: async (app: App, options: KeycloakConfig, router?: Router) => {
    try {
      const tenantStore = useTenantStore()
      await tenantStore.loadTenants()

      // Skip Keycloak initialization if no tenant
      const currentTenant = tenantStore.getCurrentTenant
      if (!currentTenant) {
        logger.warn('No tenant selected, skipping Keycloak initialization')
        if (router) {
          router.push({ name: 'tenant' })
        }
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
          redirectUri: options.initOptions?.redirectUri ?? window.location.href,
        },
      }
      logger.debug('Initializing Keycloak with config:', keycloakConfig)

      // Initialize Keycloak
      try {
        const authenticated = await keycloakService.initialize(keycloakConfig)
        app.config.globalProperties.$keycloak = keycloakService.getKeycloak()

        logger.debug('Keycloak initialized, authenticated:', authenticated)

        // If not authenticated and current route requires auth, redirect to login
        if (!authenticated && router) {
          const currentRoute = router.currentRoute.value
          const meta = currentRoute.meta

          if (
            meta.requiresAuth !== false &&
            !['tenant', 'error', 'unauthorized'].includes(
              currentRoute.name as string
            )
          ) {
            logger.warn('Route requires authentication, redirecting to login')
            await keycloakService.login(window.location.href)
          }
        }
      } catch (error) {
        logger.error('Keycloak initialization failed:', error)
        if (router) {
          router.push({ name: 'error' })
        }
      }
    } catch (error) {
      logger.error('KeycloakPlugin installation failed:', error)
      if (router) {
        router.push({ name: 'error' })
      }
    }
  },
}
