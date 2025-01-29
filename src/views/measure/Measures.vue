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
      <Column
        :class="page.table.description.location"
        :field="page.table.description.data"
        
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
import { ref, computed, onMounted } from 'vue'
// stores import
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
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import type { Property } from '@/model/property'
import { MeasuresPage } from '@/features/measure/presentation/pages/pageMeasure'
import type { IMeasure } from '@/features/measure/domain/measure'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import { MeasureService } from '@/features/measure/application/measureService'
import { MeasureRepository } from '@/features/measure/repository/measureRepository'
import { useBasePage } from '@/composable/useBasePage'
// other imports
// props

// data
const page = ref(new MeasuresPage())

// service
// service
const { notificationService } = useBasePage(page.value.title)
const measureService = new MeasureService(
  new MeasureRepository(),
  notificationService
)
const measureStore = useMeasureStore()
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
  measureService.deleteMeasure(page.value.selected!.id)
  page.value.selected = undefined
  page.value.showModal = false
}
// lifeCycle
onMounted(()=>{  
  measureStore.fetchMeasures()
})
// watch
</script>

<style scoped></style>
