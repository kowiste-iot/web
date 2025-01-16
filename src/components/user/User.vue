<template>
  <div class="position-relative over">
    <div class="px-2" role="button" @click="toggleVisibility">
      <FIcon
        class="pe-3"
        :icon="EIcon.User"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <div
      v-if="isVisible"
      class="position-absolute top-100 end-0 border rounded bg-light py-2 px-3"
      style="min-width: 10rem; width: 20rem"
      @mouseleave="toggleVisibility"
    >
      <div class="d-flex">
        <div
          class="bg-success rounded-circle mt-2 me-2 p-2 text-white d-flex justify-content-center align-items-center"
          style="height: 2.5rem; width: 2.5rem"
        >
          {{
            userInfo.firstName?.charAt(0)?.toUpperCase() +
            userInfo.lastName?.charAt(0)?.toUpperCase()
          }}
        </div>
        <div class="flex-fill ps-2">
          <div class="fs-5">{{ userInfo.fullName }}</div>
          <div>Role: {{ userInfo.roles.join(', ') }}</div>
          <div class="text-muted small">Tenant: {{ currentTenant?.name }}</div>
        </div>
      </div>
      <div class="ms-3 mt-3">
        <div class="btn d-flex" @click="router.push('/profile')">
          <FIcon class="pt-1" :icon="EIcon.User" />
          <div class="ms-4 w-auto">Profile</div>
        </div>
        <div class="btn d-flex" @click="router.push('/settings')">
          <FIcon class="pt-1" :icon="EIcon.Admin" />
          <div class="ms-4 w-auto">Settings</div>
        </div>
        <div class="btn d-flex" @click="router.push('/tenant')">
          <FIcon class="pt-1" :icon="EIcon.Tenant" />
          <div class="ms-4 w-auto">Tenant</div>
        </div>
      </div>
      
      <div class="btn d-flex border-top mt-4">
        <div class="pt-1">
          Kowiste &copy {{ timeToFormat(today(), 'yyyy') }}
        </div>
        <div class="d-flex flex-row-reverse flex-fill" @click="logout">
          <div class="ms-4">Log out</div>
          <FIcon class="pt-1" :icon="EIcon.LogOut" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, computed } from 'vue'

// stores import
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/plugins/security/store'

// components import

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import { today } from '@/utils/time/time'
import { timeToFormat } from '@/utils/time/conversion'
import { keycloakService } from '@/plugins/security/KeycloakService'
import { useTenantStore } from '@/features/tenant/stores/tenant'

// other imports
// props

// data
const isVisible = ref(false)
const isHover = ref({} as { [key: number]: boolean })

// storage calls
const router = useRouter()
const tenantStore = useTenantStore()
const authStore = useAuthStore()

// computed
const userInfo = computed(() => {
  const keycloak = authStore.keycloak
  return {
    firstName: keycloak?.tokenParsed?.given_name || '',
    lastName: keycloak?.tokenParsed?.family_name || '',
    fullName: keycloak?.tokenParsed?.name || 'Unknown User',
    email: keycloak?.tokenParsed?.email || '',
    roles: Array.from(authStore.roles) || ['No Role']
  }
})

const currentTenant = computed(() => tenantStore.getCurrentTenant)

// methods
function toggleVisibility() {
  isVisible.value = !isVisible.value
}

async function logout() {
  if (!tenantStore.currentTenant) return
  tenantStore.removeTenant(tenantStore.currentTenant.id)
  await keycloakService.logout()
}

// lifeCycle
// watch
</script>

<style scoped></style>