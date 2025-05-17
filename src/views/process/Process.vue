<template>
  <Row>
    <Col :breakpoint="EBreakpoint.LG" :size="6" class="pb-4">
      <Card class="mt-5 full-height">
        <Flex class="p-2" :justify="EFlexJustify.Between"
          >Actions
          <Button
            :icon="EIcon.Add"
            :color="EColor.Success"
            compact
            @click="() => (pageAction.showForm = true)"
          >
            Action</Button
          ></Flex
        >
        <DataTable :value="actions">
          <Column
            :class="pageAction.table.name.location"
            :field="pageAction.table.name.data"
            sortable
          >
            <template #header>
              <span class="container-fluid">
                {{ pageAction.table.name.title }}
              </span>
            </template>
            <template #body="{ data }">
              <Flex :justify="EFlexJustify.Between" :gap="3">
                {{ data[pageAction.table.name.data] }}
                <Flex :gap="2">
                  <Tooltip
                    text="belong to asset"
                    :position="ETooltipPosition.Bottom"
                  >
                    <Tag
                      v-if="data[pageAction.table.asset.data]"
                      :color="EColor.Warning"
                      :label="data[pageAction.table.asset.data]"
                    />
                  </Tooltip>
                  <Tooltip
                    text="enable/disable"
                    :position="ETooltipPosition.Bottom"
                  >
                    <Switch
                      :width="'3rem'"
                      noIcon
                      v-model="data[pageAction.table.enabled.data]"
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </template>
          </Column>

          <Column>
            <template #body="{ data }">
              <PropertyDot
                :data="pageAction.properties"
                @click="(prop:Property)=>propertySelected(prop,data)"
              />
            </template>
          </Column>
        </DataTable>
      </Card>
    </Col>
    <Col :breakpoint="EBreakpoint.LG" :size="6" class="pb-4">
      <Card class="mt-5 full-height">
        <Flex class="p-2" :justify="EFlexJustify.Between"
          >Alerts
          <Button
            :icon="EIcon.Add"
            :color="EColor.Success"
            compact
            @click="() => (pageAlert.showForm = true)"
          >
            Alert</Button
          ></Flex
        >
        <DataTable :value="alerts">
          <Column
            :class="pageAlert.table.name.location"
            :field="pageAlert.table.name.data"
            sortable
          >
            <template #header>
              <span class="container-fluid">
                {{ pageAlert.table.name.title }}
              </span>
            </template>
            <template #body="{ data }">
              <Flex :justify="EFlexJustify.Between" :gap="3">
                {{ data[pageAlert.table.name.data] }}
                <Flex :gap="2">
                  <Tooltip
                    text="belong to asset"
                    :position="ETooltipPosition.Bottom"
                  >
                    <Tag
                      v-if="data[pageAlert.table.asset.data]"
                      :color="EColor.Warning"
                      :label="data[pageAlert.table.asset.data]"
                    />
                  </Tooltip>
                  <Tooltip
                    text="enable/disable"
                    :position="ETooltipPosition.Bottom"
                  >
                    <Switch
                      :width="'3rem'"
                      noIcon
                      v-model="data[pageAlert.table.enabled.data]"
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </template>
          </Column>
          <Column>
            <template #body="{ data }">
              <PropertyDot
                :data="pageAlert.properties"
                @click="(prop:Property)=>propertySelected(prop,data)"
              />
            </template>
          </Column>
        </DataTable>
      </Card>
    </Col>
  </Row>

  <Modal v-if="pageAction.showForm || pageAlert.showForm" @cancel="closeForm">
    <SideCard class="col-md-6">
      <ActionForm
        v-if="pageAction.showForm"
        :data="pageAction.selected"
        :edit="pageAction.editForm"
        @close="closeForm"
      />
      <AlertForm
        v-if="pageAlert.showForm"
        :data="pageAlert.selected"
        :edit="pageAlert.editForm"
        @close="closeForm"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="pageAction.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('actionGUI.delete')"
    @action="deleteAsset"
    @cancel="
      () => {
        pageAction.showModal = false
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
import { useBasePage } from '@/composable/useBasePage'

// components import
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import SideCard from '@/components/cards/SideCard.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'
import Modal from '@/components/layout/Modal.vue'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import Card from '@/components/cards/Card.vue'
import Button from '@/components/buttons/Button.vue'
import Flex from '@/components/layout/Flex.vue'
import { EFlexJustify } from '@/components/layout/EFlex'
import ActionForm from './form/ActionForm.vue'
import AlertForm from './form/AlertForm.vue'
import Switch from '@/components/switch/Switch.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import type { Property } from '@/features/shared/domain/property'
import { AssetService } from '@/features/asset/application/assetService'
import { AssetRepository } from '@/features/asset/repository/assetRepository'
import { ActionPage } from '@/features/action/presentation/pages/pageAction'
import { useActionStore } from '@/features/action/stores/useActionStore'
import type { IAction } from '@/features/action/domain/action'
import { AlertPage } from '@/features/alert/presentation/pages/pageAlert'
import { useAlertStore } from '@/features/alert/stores/useAlertStore'
import { ETooltipPosition } from '@/components/tooltip/ETooltipPosition'
import Tooltip from '@/components/tooltip/Tooltip.vue'
import Tag from '@/components/tag/Tag.vue'
import { EBreakpoint } from '@/components/layout/grid/model'
import { Page } from '@/features/shared/presentation/pages/pageBase'
import { useI18n } from 'vue-i18n'
// other imports
// props

// data
const { t } = useI18n()
const page = reactive(new Page(t('process.title')))
const pageAction = reactive(new ActionPage())
const pageAlert = reactive(new AlertPage())

//service
const { notificationService } = useBasePage(page.title)
const assetService = new AssetService(
  new AssetRepository(),
  notificationService
)
const actionStore = useActionStore()
const alertStore = useAlertStore()
const sessionStore = useSessionStore()

// computed
const actions = computed(() => {
  return actionStore.actions
})
const alerts = computed(() => {
  return alertStore.alerts
})
const branch = computed(() => {
  return sessionStore.getCurrentBranch
})

// methods
function propertySelected(prop: Property, data: IAction) {
  pageAction.selected = data
  switch (prop.id) {
    case 1:
      pageAction.showForm = true
      pageAction.editForm = true
      break
    case 2:
      pageAction.showModal = true
      break
  }
}
async function deleteAsset() {
  await assetService.deleteAsset(pageAction.selected!.id!)
  pageAction.selected = undefined
  pageAction.showModal = false
  refreshData()
}
function closeForm() {
  refreshData()
  pageAction.reset()
  pageAlert.reset()
}
async function refreshData() {
  await actionStore.fetchActions()
  await alertStore.fetchAlerts()
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
