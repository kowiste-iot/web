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
            @click="(prop:Property)=>propertySelected(prop,data)"
          />
        </template>
      </Column>
    </DataTable>
  </TabletCard>

  <Modal v-if="page.showForm" @cancel="closeForm">
    <SideCard class="col-md-12">
      <ResourceForm
        :data="page.selected"
        :edit="page.editForm"
        :close="closeForm"
      />
    </SideCard>
  </Modal>
</template>

<script setup lang="ts">
// imports
import { computed, onMounted, reactive, watch } from 'vue'
// stores import
import { useSessionStore } from '@/features/session/store/useSessionStore'
import { useResourceStore } from '@/features/resource/stores/useResourceStore'

// components import
// model imports
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import type { Property } from '@/features/shared/domain/property'
import Modal from '@/components/layout/Modal.vue'
import { ResourcesPage } from '@/features/resource/presentation/pages/pageResource'
import ResourceForm from './form/ResourceForm.vue'
import type { IResource } from '@/features/resource/domain/resource'
// other imports
// props

// data
const page = reactive(new ResourcesPage())

//service
const resourceStore = useResourceStore()
const sessionStore = useSessionStore()

// computed
const resources = computed(() => {
  return resourceStore.resources
})
const branch = computed(() => {
  return sessionStore.getCurrentBranch
})
// methods
function propertySelected(prop: Property, data: IResource) {
  page.selected = data
  switch (prop.id) {
    case 1:
      page.showForm = true
      page.editForm = true
      break
  }
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
