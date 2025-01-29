<template>
  <TabletCard class="mt-5">
    <DataTable :value="assets">
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
      <AssetForm
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
import { computed, onMounted, reactive, watch } from 'vue'
// stores import
import { useSessionStore } from '@/features/session/store/useSessionStore'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { useBasePage } from '@/composable/useBasePage'

// components import
// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { AssetsPage } from '@/features/asset/presentation/pages/pageAssets'
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import type { Property } from '@/model/property'
import AssetForm from '@/views/asset/form/AssetForm.vue'
import Modal from '@/components/cards/Modal.vue'
import type { IAsset } from '@/features/asset/domain/asset'

import { AssetService } from '@/features/asset/application/assetService'
import { AssetRepository } from '@/features/asset/repository/assetRepository'
// other imports
// props

// data
const page = reactive(new AssetsPage())

//service
const { notificationService } = useBasePage(page.title)
const assetService = new AssetService(
  new AssetRepository(),
  notificationService
)
const assetStore = useAssetStore()
const sessionStore = useSessionStore()

// computed
const assets = computed(() => {
  return assetStore.assets
})
const branch = computed(() => {
  return sessionStore.getCurrentBranch
})
// methods
function propertySelected(prop: Property, data: IAsset) {
  page.selected = data
  switch (prop.id) {
    case 1:
      page.showForm = true
      page.editForm = true
      break
    case 2:
      page.showModal = true
      break
  }
}
async function deleteAsset() {
  await assetService.deleteAsset(page.selected!.id!)
  page.selected = undefined
  page.showModal = false
  refreshData()
}
function closeForm() {
  refreshData()
  page.reset()
}
async function refreshData() {
  await assetStore.fetchAssets()
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
