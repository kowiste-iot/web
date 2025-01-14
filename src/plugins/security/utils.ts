import { useTenantStore } from '@/features/tenant/stores/tenant'

export function extractRealmFromPath(): string {
  const tenantStore = useTenantStore()
  const currentTenant = tenantStore.getCurrentTenant
  return currentTenant?.id || 'undefined'
}
export function validateRealm(realm: string): boolean {
  if (!realm || realm === 'undefined') return false
  if (realm.length < 2) return false
  // Add any other validation rules
  return true
}
