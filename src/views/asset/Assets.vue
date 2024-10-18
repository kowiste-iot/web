<template>
  <TabletCard class="mt-5">
    <DataTable
      :value="assets"
      :tableStyle="{ 'min-width': '5rem' }"
      size="small"
      paginator
      :rows="5"
      :pt="{
        table: 'table table-striped',
        pcPaginator: 'btn bg-danger border border-danger',
      }"
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
  <SideCard v-if="page.showForm" class="col-md-6">
    <AssetForm
      :data="page.selected"
      :edit="page.editForm"
      :close="() => (page.showForm = false)"
    />
  </SideCard>
  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('action.delete')"
    :onAction="deleteAsset"
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
import { useAsset } from '@/stores/asset/asset'
// components import
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { EActionGUI } from '@/enums/gui/EActionGUI'
import { AssetsPage } from '@/model/asset/page/pageAssets'
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import type { Property } from '@/model/property'
import type { IAsset } from '@/model/asset/asset'
import AssetForm from '@/views/asset/form/AssetForm.vue'
// other imports
// props

// data
const page = ref(new AssetsPage())
// storage calls
useBreadCrumb().set(page.value.title)
const assetStore = useAsset()
// computed
const assets = computed(() => {
  return assetStore.assets
})
// methods
function propertySelected(prop: Property, data: IAsset) {
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
function deleteAsset() {
  assetStore.delete(page.value.selected!)
  page.value.selected = undefined
  page.value.showModal = false
}
// lifeCycle
// watch
</script>

<style scoped></style>
