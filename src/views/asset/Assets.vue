<template>
  <Row>
    <Col :breakpoint="EBreakpoint.LG" :size="6" class="pb-4">
      <Card class="mt-5 h-100">
        <CardHeader
          :headerIcon="EIcon.Asset"
          :headerText="'Assets'"
          :buttonText="'Asset'"
          @click="() => (pageAsset.showForm = true)"
        />
        <DataTable :value="assets" :rows="4">
          <Column
            :class="pageAsset.table.name.location"
            :field="pageAsset.table.name.data"
            sortable
          >
            <template #header>
              <span class="container-fluid">
                {{ pageAsset.table.name.title }}
              </span>
            </template>
            <template #body="{ data }">
              <Flex :justify="EFlexJustify.Between" :gap="3">
                {{ data[pageAsset.table.name.data] }}
                <Tooltip
                  text="belong to asset"
                  :position="ETooltipPosition.Bottom"
                >
                  <Tag
                    v-if="data[pageAsset.table.asset.data]"
                    :color="EColor.Warning"
                    :label="data[pageAsset.table.asset.data]"
                  />
                </Tooltip>
              </Flex>
            </template>
          </Column>

          <Column>
            <template #body="{ data }">
              <PropertyDot
                :data="pageAsset.properties"
                @click="(prop) => pageAsset.propertySelected(prop.id, data)"
              />
            </template>
          </Column>
        </DataTable>
      </Card>
    </Col>
    <Col :breakpoint="EBreakpoint.LG" :size="6" class="pb-4">
      <Card class="mt-5 h-100">
        <CardHeader
          :headerIcon="EIcon.Measure"
          :headerText="'Measures'"
          :buttonText="'Measure'"
          @click="() => (pageMeasure.showForm = true)"
        />
        <DataTable :value="measures" :rows="4">
          <Column
            :class="pageMeasure.table.name.location"
            :field="pageMeasure.table.name.data"
            sortable
          >
            <template #header>
              <span class="container-fluid">
                {{ pageMeasure.table.name.title }}
              </span>
            </template>
            <template #body="{ data }">
              <Flex :justify="EFlexJustify.Between" :gap="3">
                {{ data[pageMeasure.table.name.data] }}
                <Tooltip
                  text="belong to asset"
                  :position="ETooltipPosition.Bottom"
                >
                  <Tag
                    v-if="data[pageMeasure.table.asset.data]"
                    :color="EColor.Warning"
                    :label="data[pageMeasure.table.asset.data]"
                  />
                </Tooltip>
              </Flex>
            </template>
          </Column>
          <Column>
            <template #body="{ data }">
              <PropertyDot
                :data="pageMeasure.properties"
                @click="(prop) => pageMeasure.propertySelected(prop.id, data)"
              />
            </template>
          </Column>
        </DataTable>
      </Card>
    </Col>
    <Col :breakpoint="EBreakpoint.LG" :size="6">
      <Card class="mt-5">
        <CardHeader
          :headerIcon="EIcon.Device"
          :headerText="'Devices'"
          :buttonText="'Device'"
          @click="() => (pageDevice.showForm = true)"
        />
        <DataTable :value="devices" :rows="4">
          <Column
            :class="pageDevice.table.name.location"
            :field="pageDevice.table.name.data"
            sortable
          >
            <template #header>
              <span class="container-fluid">
                {{ pageDevice.table.name.title }}
              </span>
            </template>
            <template #body="{ data }">
              <Flex :justify="EFlexJustify.Between" :gap="3">
                {{ data[pageDevice.table.name.data] }}
                <Tooltip
                  text="belong to asset"
                  :position="ETooltipPosition.Bottom"
                >
                  <Tag
                    v-if="data[pageDevice.table.asset.data]"
                    :color="EColor.Warning"
                    :label="data[pageDevice.table.asset.data]"
                  />
                </Tooltip>
              </Flex>
            </template>
          </Column>

          <Column>
            <template #body="{ data }">
              <PropertyDot
                :data="pageDevice.properties"
                @click="(prop) => pageDevice.propertySelected(prop.id, data)"
              />
            </template>
          </Column>
        </DataTable>
      </Card>
    </Col>
  </Row>

  <Modal
    v-if="pageAsset.showForm || pageMeasure.showForm || pageDevice.showForm"
    @cancel="closeForm"
  >
    <SideCard class="col-md-6">
      <AssetForm
        v-if="pageAsset.showForm"
        :data="pageAsset.selected"
        :edit="pageAsset.editForm"
        @close="closeForm"
      />
      <MeasureForm
        v-if="pageMeasure.showForm"
        :data="pageMeasure.selected"
        :edit="pageMeasure.editForm"
        @close="closeForm"
      />
      <DeviceForm
        v-if="pageDevice.showForm"
        :data="pageDevice.selected"
        :edit="pageDevice.editForm"
        @close="closeForm"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="pageAsset.showModal || pageMeasure.showModal || pageDevice.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('actionGUI.delete')"
    @action="deleteItem"
    @cancel="closeForm"
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
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import AssetForm from '@/views/asset/form/AssetForm.vue'
import Modal from '@/components/layout/Modal.vue'

import { AssetService } from '@/features/asset/application/assetService'
import { AssetRepository } from '@/features/asset/repository/assetRepository'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import { MeasuresPage } from '@/features/measure/presentation/pages/pageMeasure'
import { useMeasureStore } from '@/features/measure/stores/useMeasureStore'
import Card from '@/components/cards/Card.vue'
import Flex from '@/components/layout/Flex.vue'
import { EFlexJustify } from '@/components/layout/EFlex'
import { DevicePage } from '@/features/device/presentation/pages/pageDevice'
import { useDeviceStore } from '@/features/device/stores/useDeviceStore'
import Tag from '@/components/tag/Tag.vue'
import Tooltip from '@/components/tooltip/Tooltip.vue'
import { ETooltipPosition } from '@/components/tooltip/ETooltipPosition'
import MeasureForm from './form/MeasureForm.vue'
import DeviceForm from './form/DeviceForm.vue'
import { Page } from '@/features/shared/presentation/pages/pageBase'
import { useI18n } from 'vue-i18n'
import { EBreakpoint } from '@/components/layout/grid/model'
import CardHeader from '@/components/cards/CardHeader.vue'
import { MeasureService } from '@/features/measure/application/measureService'
import { MeasureRepository } from '@/features/measure/repository/measureRepository'
import { DeviceService } from '@/features/device/application/deviceService'
import { DeviceRepository } from '@/features/device/repository/deviceRepository'
// other imports
// props

// data
const { t } = useI18n()
const page = reactive(new Page(t('asset.title')))
const pageAsset = reactive(new AssetsPage())
const pageMeasure = reactive(new MeasuresPage())
const pageDevice = reactive(new DevicePage())

//service
const { notificationService } = useBasePage(page.title)
const assetService = new AssetService(
  new AssetRepository(),
  notificationService
)
const assetStore = useAssetStore()

const measureService = new MeasureService(
  new MeasureRepository(),
  notificationService,
  assetStore
)
const measureStore = useMeasureStore()

const deviceService = new DeviceService(
  new DeviceRepository(),
  notificationService
)
const deviceStore = useDeviceStore()

const sessionStore = useSessionStore()

// computed
const assets = computed(() => {
  return assetStore.assets
})
const measures = computed(() => {
  return measureStore.measures
})
const branch = computed(() => {
  return sessionStore.getCurrentBranch
})
const devices = computed(() => {
  return deviceStore.devices
})
// methods

async function deleteItem() {
  if (pageAsset.showModal) {
    await assetService.deleteAsset(pageAsset.selected!.id!)
  } else if (pageMeasure.showModal) {
    await measureService.deleteMeasure(pageMeasure.selected!.id!)
  } else if (pageDevice.showModal) {
    await deviceService.deleteDevice(pageDevice.selected!.id!)
  }

  closeForm()
}
function closeForm() {
  refreshData()
  pageAsset.reset()
  pageMeasure.reset()
  pageDevice.reset()
}
async function refreshData() {
  await assetStore.fetchAssets()
  await measureStore.fetchMeasures()
  await deviceStore.fetchDevices()
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
