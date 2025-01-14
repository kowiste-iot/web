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
              <div>
                <Button
                  :color="EColor.Danger"
                  :icon="EIcon.Delete"
                  @click="removeTenant(tenant.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="add-tenant">
          <h3>{{ tenants.length ? 'Add New Tenant' : 'Enter Tenant' }}</h3>
          <div class="p-inputgroup">
            <div class="d-flex gap-3">
              <Input
                :placeholder="$t('tenant.inputName')"
                type="text"
                v-model="newTenantId"
              />
              <Button
                class="px-4"
                :color="EColor.Warning"
                :icon="EIcon.Next"
                @click="addNewTenant"
              />
            </div>

            <Button v-if="newTenantId != ''" @click="addNewTenant" />
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
import Input from '@/components/form/Input.vue'
import Button from '@/components/buttons/Button.vue'
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'

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
      newTenantId.value = ''
      errorMessage.value = ''
      await router.push('/')
    } else {
      errorMessage.value = result.error || 'Failed to add tenant'
    }
  }
}

async function selectTenant(tenantId: string) {
  tenantStore.setCurrentTenant(tenantId)
  await router.push('/')
}

function removeTenant(tenantId: string) {
  tenantStore.removeTenant(tenantId)
}
</script>

<style scoped></style>
