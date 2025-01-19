<template>
  <TabletCard class="mt-5">
    <DataTable :value="resources">
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


      <Column>
        <template #body="{ data }">
          <PropertyDot
            :data="page.properties"
            :onClick="(prop:Property)=>propertySelected(prop,data)"
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
  <Modal v-if="page.showForm">
    <SideCard class="col-md-6">
      <ResourceForm
        :data="page.selected"
        :edit="page.editForm"
        :close="closeForm"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('action.delete')"
    :onAction="deleteResource"
    :onCancel="
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
import type { Property } from '@/model/property'
import Modal from '@/components/cards/Modal.vue'
import type { IAsset } from '@/features/asset/domain/asset'
import { useBasePage } from '@/composable/useBasePage'
import { RolesPage } from '@/features/role/presentation/pages/pageRoles'
import { RoleService } from '@/features/role/application/roleService'
import { RoleRepository } from '@/features/role/repository/roleRepository'
import { useRoleStore } from '@/features/role/stores/useRoleStore'
import { useUserStore } from '@/features/user/stores/useUserStore'
import RoleForm from './form/RoleForm.vue'
import { ResourcesPage } from '@/features/resource/presentation/pages/pageResource'
import { ResourceService } from '@/features/resource/application/resourceService'
import { ResourceRepository } from '@/features/resource/repository/resourceRepository'
import { useResourceStore } from '@/features/resource/stores/useResourceStore'
import ResourceForm from './form/ResourceForm.vue'
// other imports
// props

// data
const page = reactive(new ResourcesPage())

//service
const { notificationService } = useBasePage(page.title)
const resourceService = new ResourceService(new ResourceRepository(), notificationService)
const resourceStore = useResourceStore()
const userStore = useUserStore()

// computed
const resources = computed(() => {
  return resourceStore.resources
})
const branch = computed(() => {
  return userStore.getCurrentBranch
})
// methods
function propertySelected(prop: Property, data: IAsset) {
  page.selected = data
  switch (prop.id) {
    case 1:
      page.showModal = true
      break
  }
}
async function deleteResource() {
  await resourceService.deleteResource(page.selected!.id!)
  page.selected = undefined
  page.showModal = false
  refreshData()
}
function closeForm() {
  refreshData()
  page.reset()
}
async function refreshData() {
  await resourceStore.fetchResources()
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
