<template>
  <TabletCard class="mt-5">
    <DataTable :value="measures">
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
        :class="page.table.asset.location"
        :field="page.table.asset.data"
        sortable
      >
        <template #header>
          <span class="container-fluid">
            {{ page.table.asset.title }}
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
      <MeasureForm
        :data="page.selected"
        :edit="page.editForm"
        :close="() => (page.showForm = false)"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('action.delete')"
    :onAction="deleteMeasure"
    :onCancel="
      () => {
        page.showModal = false
      }
    "
  >
    <div class="text-center">{{ $t('asset.delete') }}</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { ref, computed } from 'vue'
// stores import

import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { useMeasure } from '@/stores/measure/measure'
// components import
import MeasureForm from '@/views/measure/form/MeasureForm.vue'
import Modal from '@/components/cards/Modal.vue'
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { EActionGUI } from '@/enums/gui/EActionGUI'
import type { Property } from '@/model/property'
import { MeasuresPage } from '@/model/measure/page/pageMeasure'
import type { IMeasure } from '@/model/measure/measure'
// other imports
// props

// data
const page = ref(new MeasuresPage())
// storage calls
useBreadCrumb().set(page.value.title)
const measureStore = useMeasure()
// computed
const measures = computed(() => {
  return measureStore.measures
})
// methods
function propertySelected(prop: Property, data: IMeasure) {
  page.value.selected = data
  switch (prop.id) {
    case 1:
      page.value.showForm = true
      page.value.editForm = true
      break
    case 2:
      page.value.showModal = true

      break
  }
}
function deleteMeasure() {
  measureStore.delete(page.value.selected!)
  page.value.selected = undefined
  page.value.showModal = false
}
// lifeCycle
// watch
</script>

<style scoped></style>
