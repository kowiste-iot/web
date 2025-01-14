import { useTenantStore } from '@/features/tenant/stores/tenant'

export function useTenant() {
  const tenantStore = useTenantStore()

  function getTenantId(): string {
    const currentTenant = tenantStore.getCurrentTenant
    return currentTenant?.id || 'undefined'
  }

  return {
    getTenantId,
  }
}
