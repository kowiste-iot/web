<template>
  <div class="container">
    <div class="row min-vh-100 align-items-center justify-content-center">
      <div class="col-auto">
        <div v-if="tenants.length" class="tenant-list">
          <h3>Select Tenant</h3>
          <div v-for="tenant in tenants" :key="tenant.id" class="tenant-item">
            <div class="d-flex gap-1">
              <div
                class="flex-fill text-center border py-3"
                :class="EColor.MenuBg"
                role="button"
                @click="selectTenant(tenant.id)"
              >
                {{ tenant.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="add-tenant">
          <Reveal :delay="200" :duration="1000" :growDirection="EGrow.RIGHT">
            <h3>
              {{ tenants.length ? 'Add New Tenant' : 'Enter Tenant' }}
            </h3></Reveal
          >

          <div class="p-inputgroup">
            <Reveal :delay="200" :duration="1000">
              <div class="d-flex gap-3">
                <Input
                  :placeholder="$t('tenant.inputName')"
                  type="text"
                  @enter="addNewTenant"
                  v-model="newTenantId"
                />
                <Button
                  class="px-4"
                  :color="EColor.Warning"
                  :icon="EIcon.Next"
                  @click="addNewTenant"
                />
              </div>
            </Reveal>
          </div>
          <small class="p-error block mt-2" v-if="errorMessage">{{
            errorMessage
          }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/features/tenant/stores/tenant'
import { keycloakService } from '@/plugins/security/KeycloakService'
import Input from '@/components/form/Input.vue'
import Button from '@/components/buttons/Button.vue'
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import Reveal from '@/components/animation/reveal/Reveal.vue'
import { EGrow } from '@/components/animation/reveal/types'

const router = useRouter()
const tenantStore = useTenantStore()
const newTenantId = ref('')
const errorMessage = ref('')

const tenants = computed(() => tenantStore.getAllTenants)

onMounted(() => {
  tenantStore.loadTenants()
})

async function addNewTenant() {
  if (newTenantId.value) {
    const result = tenantStore.addTenant(newTenantId.value, newTenantId.value)
    if (result.success) {
      try {
        // Initialize Keycloak with new tenant
        await keycloakService.updateRealm(newTenantId.value)
        newTenantId.value = ''
        errorMessage.value = ''
        await router.push('/')
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error)
        errorMessage.value = 'Failed to initialize tenant authentication'
      }
    } else {
      errorMessage.value = result.error || 'Failed to add tenant'
    }
  }
}

async function selectTenant(tenantId: string) {
  try {
    await tenantStore.setCurrentTenant(tenantId)
    // Initialize Keycloak with selected tenant
    await keycloakService.updateRealm(tenantId)
    await router.push('/')
  } catch (error) {
    console.error('Failed to initialize tenant:', error)
    errorMessage.value = 'Failed to initialize tenant authentication'
  }
}
</script>

<style scoped></style>
