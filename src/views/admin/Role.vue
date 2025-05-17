<template>
  <TabletCard class="mt-5">
    <DataTable :value="roles">
      <Column
        :class="page.table.name.location"
        :field="page.table.name.data"
        sortable
      >
        <template #header>
          <span class="container-fluid">
            {{ page.table.name.title }}
          </span>
        </template>
      </Column>
      <Column
        :class="page.table.description.location"
        :field="page.table.description.data"
        sortable
      >
        <template #header>
          <span class="container-fluid">
            {{ page.table.description.title }}
          </span>
        </template>
      </Column>

      <Column>
        <template #body="{ data }">
          <PropertyDot
            v-if="!data.readonly"
            :data="page.properties"
            @click="(prop:Property)=>propertySelected(prop,data)"
          />
        </template>
      </Column>
    </DataTable>
  </TabletCard>
  <div
    class="d-flex flex-column"
    style="position: fixed; top: 4rem; right: 1rem"
  >
    <FIcon
      :class="`text-${EColor.Success}`"
      :icon="EIcon.Add"
      role="button"
      style="height: 1.5rem"
      @click="() => (page.showForm = true)"
    />
  </div>
  <Modal v-if="page.showForm" @cancel="closeForm">
    <SideCard class="col-md-6">
      <RoleForm
        :data="page.selected"
        :edit="page.editForm"
        :close="closeForm"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('actionGUI.delete')"
    @action="deleteRole"
    @cancel="
      () => {
        page.showModal = false
      }
    "
  >
    <div class="text-center">{{ $t('role.delete') }}</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, reactive, watch } from 'vue'
// stores import
import { useRoleStore } from '@/features/role/stores/useRoleStore'
import { useSessionStore } from '@/features/session/store/useSessionStore'
// components import
// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import type { Property } from '@/features/shared/domain/property'
import Modal from '@/components/layout/Modal.vue'
import { useBasePage } from '@/composable/useBasePage'
import { RolesPage } from '@/features/role/presentation/pages/pageRoles'
import { RoleService } from '@/features/role/application/roleService'
import { RoleRepository } from '@/features/role/repository/roleRepository'

import RoleForm from './form/RoleForm.vue'
import type { IRole } from '@/features/role/domain/role'
// other imports
// props

// data
const page = reactive(new RolesPage())

//service
const { notificationService } = useBasePage(page.title)
const roleService = new RoleService(new RoleRepository(), notificationService)
const roleStore = useRoleStore()
const sessionStore = useSessionStore()

// computed
const roles = computed(() => {
  return roleStore.roles
})
const branch = computed(() => {
  return sessionStore.getCurrentBranch
})
// methods
function propertySelected(prop: Property, data: IRole) {
  page.selected = data
  switch (prop.id) {
    case 1:
      page.showModal = true
      break
  }
}
async function deleteRole() {
  await roleService.deleteRole(page.selected!.name!)
  page.selected = undefined
  page.showModal = false
  refreshData()
}
function closeForm() {
  refreshData()
  page.reset()
}
async function refreshData() {
  await roleStore.fetchRoles()
}
// lifeCycle
onMounted(() => {
  refreshData()
})
// watch
watch(
  () => branch.value,
  async () => {
    await refreshData()
  }
)
</script>

<style scoped></style>
