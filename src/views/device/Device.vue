<template>
  <TabletCard class="mt-5">
    <DataTable
      :value="devices"
    >
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
      <DeviceForm
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
    :onAction="deleteDevice"
    :onCancel="
      () => {
        page.showModal = false
      }
    "
  >
    <div class="text-center">{{ $t('device.delete') }}</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { ref, computed } from 'vue'
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { useDevice } from '@/stores/device/device'

// components import
import DeviceForm from '@/views/device/form/DeviceForm.vue'
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import Modal from '@/components/cards/Modal.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { EActionGUI } from '@/enums/gui/EActionGUI'
import type { Property } from '@/model/property'
import { DevicePage } from '@/model/device/page/pageDevice'
import type { IDevice } from '@/model/device/device'
// other imports
// props

// data
const page = ref(new DevicePage())
// storage calls
useBreadCrumb().set(page.value.title)
const deviceStore = useDevice()
// computed
const devices = computed(() => {
  return deviceStore.devices
})
// methods
function propertySelected(prop: Property, data: IDevice) {
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
function deleteDevice() {
  deviceStore.delete(page.value.selected!)
  page.value.selected = undefined
  page.value.showModal = false
}
// lifeCycle
// watch
</script>

<style scoped></style>
