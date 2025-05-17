<template>
  <div class="position-relative over">
    <div id="menu-profile-button" class="px-2" role="button" @click="toggleVisibility">
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
          {{ sessionStore.getUserInitials }}
        </div>
        <div class="flex-fill ps-2">
          <div class="fs-5">{{ sessionStore.userInfo?.fullName }}</div>
          <div>Role: {{ sessionStore.userInfo?.roles.join(', ') }}</div>
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
        <div
          id="menu-tour"
          class="btn d-flex"
          @click="sessionStore.openTour = true"
        >
          <FIcon class="pt-1" :icon="EIcon.WalkThrough" />
          <div class="ms-4 w-auto">Tour</div>
        </div>
      </div>

      <div class="btn d-flex border-top mt-4">
        <div class="pt-1">
          Kowiste &copy {{ timeToFormat(today(), 'yyyy') }}
        </div>
        <div class="d-flex flex-row-reverse flex-fill" @click="handleLogout">
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
import { useTenantStore } from '@/features/tenant/stores/tenant'
import { useSessionStore } from '@/features/session/store/useSessionStore'

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import { today } from '@/utils/time/time'
import { timeToFormat } from '@/utils/time/conversion'
import { keycloakService } from '@/plugins/security/KeycloakService'

// data
const isVisible = ref(false)

// storage calls
const router = useRouter()
const sessionStore = useSessionStore()
const tenantStore = useTenantStore()

// computed
const currentTenant = computed(() => tenantStore.getCurrentTenant)

// methods
function toggleVisibility() {
  isVisible.value = !isVisible.value
}

async function handleLogout() {
  if (!tenantStore.currentTenant) return
  tenantStore.removeTenant(tenantStore.currentTenant.id)
  await keycloakService.logout()
}
</script>

<style scoped></style>
