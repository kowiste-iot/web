// plugins/security/utils.ts
import { useTenantStore } from '@/features/tenant/stores/tenant'
import logger from '@/utils/log/logger'

/**
 * Extract realm from current tenant
 * @returns The realm ID or 'undefined' if no tenant is selected
 */
export function extractRealmFromPath(): string {
  const tenantStore = useTenantStore()
  const currentTenant = tenantStore.getCurrentTenant

  if (!currentTenant?.id) {
    logger.warn('No tenant found or tenant has no ID')
    return 'undefined'
  }

  return currentTenant.id
}

/**
 * Validate that the realm is properly formatted
 * @param realm The realm to validate
 * @returns true if valid, false otherwise
 */
export function validateRealm(realm: string): boolean {
  if (!realm || realm === 'undefined') {
    logger.warn('Invalid realm: empty or undefined')
    return false
  }

  if (realm.length < 2) {
    logger.warn('Invalid realm: too short')
    return false
  }

  // Validate realm format - this can be customized based on your requirements
  const validRealmPattern = /^[a-zA-Z0-9_-]+$/
  if (!validRealmPattern.test(realm)) {
    logger.warn('Invalid realm format')
    return false
  }

  return true
}

/**
 * Get realm from URL path parameters
 * Useful for tenant-specific routes
 */
export function getRealmFromPath(): string | null {
  const pathParts = window.location.pathname.split('/')
  // Assuming realm is the first path segment after the base URL
  const potentialRealm = pathParts[1]

  if (potentialRealm && validateRealm(potentialRealm)) {
    return potentialRealm
  }

  return null
}

/**
 * Helper to check if we are on a public route
 */
export function isPublicRoute(routeName: string  | undefined): boolean {
  if (!routeName) return false
  const publicRoutes = ['tenant', 'error', 'unauthorized', 'login','onboard']
  return publicRoutes.includes(routeName)
}
