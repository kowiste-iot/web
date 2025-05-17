// features/tenant/router/router.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useTenantStore } from '../stores/tenant'
import { keycloakService } from '@/plugins/security/KeycloakService'
import { isPublicRoute } from '@/plugins/security/utils'
import logger from '@/utils/log/logger'

export interface AuthMeta {
  requiresAuth?: boolean
  roles?: string[]
  resource?: string
  permissions?: string[]
}

// Keep track of tenant validation status to prevent double processing
let tenantValidated = false

export async function tenantGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Always allow access to these routes
  if (to.name === 'tenant' || to.name === 'error' || to.name === 'unauthorized') {
    next()
    return
  }

  const tenantStore = useTenantStore()
  await tenantStore.loadTenants()
  
  const currentTenant = tenantStore.getCurrentTenant
  
  // If no tenant is selected, redirect to tenant selection
  if (!currentTenant) {
    logger.warn('No tenant selected, redirecting to tenant selection')
    next({ name: 'tenant' })
    return
  }

  // If tenant changed or not validated yet, validate it
  if (!tenantValidated || from.name === 'tenant') {
    tenantValidated = true

    // If the realm doesn't match the current tenant, update it
    if (keycloakService.isInitialized) {
      const kc = keycloakService.getKeycloak()
      if (kc && kc.realm !== currentTenant.id) {
        logger.debug('Tenant changed, updating Keycloak realm')
        
        try {
          // Update the realm (this will trigger a redirect if needed)
          await keycloakService.updateRealm(currentTenant.id)
          
          // If we're here, the realm was updated successfully
          // The updateRealm function will handle the redirect if needed
          next()
          return
        } catch (error) {
          logger.error('Failed to update realm:', error)
          next({ name: 'error', query: { reason: 'realm_update_failed' } })
          return
        }
      }
    }
  }

  // Continue to the next guard
  next()
}