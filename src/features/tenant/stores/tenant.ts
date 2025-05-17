import { defineStore } from 'pinia'
import type { ITenant } from '../domain/tenant'
import { RESERVED_TENANTS } from '../domain/constant'
import type { ID } from '@/features/shared/domain/id'

interface TenantState {
  tenants: ITenant[]
  currentTenant: ITenant | null
}

export const useTenantStore = defineStore('tenant', {
  state: (): TenantState => ({
    tenants: [],
    currentTenant: null,
  }),

  getters: {
    getCurrentTenant: (state) => state.currentTenant,
    getAllTenants: (state) => state.tenants,
  },

  actions: {
    loadTenants() {
      const storedTenants = localStorage.getItem('tenants')
      if (storedTenants) {
        this.tenants = JSON.parse(storedTenants)
      }

      const currentTenant = localStorage.getItem('currentTenant')
      if (currentTenant) {
        this.currentTenant = JSON.parse(currentTenant)
      }
    },

    validateTenantId(tenantId: string): { valid: boolean; error?: string } {
      if (RESERVED_TENANTS.includes(tenantId.toLowerCase())) {
        return {
          valid: false,
          error: 'This tenant ID is reserved and cannot be used',
        }
      }
      if (tenantId.length < 3) {
        return {
          valid: false,
          error: 'Tenant ID must be at least 3 characters long',
        }
      }
      if (!/^[a-zA-Z0-9-]+$/.test(tenantId)) {
        return {
          valid: false,
          error: 'Tenant ID can only contain letters, numbers, and hyphens',
        }
      }
      return { valid: true }
    },

    addTenant(
      tenantId: ID,
      tenantName: string,
      email?: string // Add optional email parameter
    ): { success: boolean; error?: string } {
      const validation = this.validateTenantId(tenantId)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      if (this.tenants.some((t) => t.id === tenantId)) {
        return { success: false, error: 'This tenant ID already exists' }
      }

      const newTenant: ITenant = {
        id: tenantId,
        name: tenantName,
        lastAccessed: new Date(),
        email: email, // Store the email
      }

      this.tenants.push(newTenant)
      localStorage.setItem('tenants', JSON.stringify(this.tenants))
      this.setCurrentTenant(tenantId)

      return { success: true }
    },

    setCurrentTenant(tenantId: string) {
      const tenant = this.tenants.find((t) => t.id === tenantId)
      if (tenant) {
        tenant.lastAccessed = new Date()
        this.currentTenant = tenant
        localStorage.setItem('currentTenant', JSON.stringify(tenant))
        localStorage.setItem('tenants', JSON.stringify(this.tenants))
      }
    },

    removeTenant(tenantId: string) {
      this.tenants = this.tenants.filter((t) => t.id !== tenantId)
      localStorage.setItem('tenants', JSON.stringify(this.tenants))

      if (this.currentTenant?.id === tenantId) {
        const lastTenant = this.tenants[this.tenants.length - 1]
        this.currentTenant = lastTenant || null
        localStorage.setItem(
          'currentTenant',
          JSON.stringify(this.currentTenant)
        )
      }
    },
  },
})
