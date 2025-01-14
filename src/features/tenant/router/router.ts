import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useTenantStore } from '../stores/tenant'
import type { ResourcePermission, Role } from '@/plugins/security/types'

export interface AuthMeta {
  requiresAuth?: boolean
  roles?: Role[]
  resource?: string
  permissions?: ResourcePermission[]
}

// Tenant guard
export function tenantGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const tenantStore = useTenantStore()
  const publicRoutes = ['tenant', 'error', 'unauthorized']

  // Load tenants
  tenantStore.loadTenants()

  // If it's a public route, allow
  if (publicRoutes.includes(to.name as string)) {
    next()
    return
  }

  // If no tenant selected, redirect to tenant selection
  if (!tenantStore.getCurrentTenant) {
    next({ name: 'tenant' })
    return
  }

  next()
}
