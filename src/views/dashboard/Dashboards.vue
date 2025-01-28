<template>
  <TabletCard class="mt-5">
    <DataTable :value="dashboards">
      <Column style="width: 5px">
        <template #body="{ data }">
          <Button
            :color="EColor.Primary"
            small
            @click="getRouter().push('/dashboard/' + data.id)"
            >{{ $t('dashboard.goto') }}</Button
          >
        </template>
      </Column>
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
    <SideCard class="col-12 col-sm-10 col-md-6 col-lg-4">
      <DashboardForm
        :data="page.selected"
        :edit="page.editForm"
        :close="() => page.closeForm()"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('action.delete')"
    :onAction="deleteDashboard"
    :onCancel="
      () => {
        page.showModal = false
      }
    "
  >
    <div class="text-center">{{ $t('dashboard.delete') }}</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { ref, computed, onMounted } from 'vue'
// stores import

// components import
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from '@/components/table/DefaulTable.vue'
import Column from 'primevue/column'
import Button from '@/components/buttons/Button.vue'
import SideCard from '@/components/cards/SideCard.vue'
import DashboardForm from '@/views/dashboard/form/DashboardForm.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import { getRouter } from '@/router'
import type { Property } from '@/model/property'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { DashboardsPage } from '@/features/dashboard/presentation/pages/pageDashboards'
import Modal from '@/components/cards/Modal.vue'
import type { IDashboard } from '@/features/dashboard/domain/dashboard'
import { useDashboardStore } from '@/features/dashboard/stores/useDashboardStore'
import { DashboardService } from '@/features/dashboard/application/dashboardService'
import { DashboardRepository } from '@/features/dashboard/repository/dashboardRepository'
import { useBasePage } from '@/composable/useBasePage'
// other imports
// props
// data
const page = ref(new DashboardsPage())

// service
const { notificationService } = useBasePage(page.value.title)
const dashboardService = new DashboardService(
  new DashboardRepository(),
  notificationService
)
const dashboardStore = useDashboardStore()

// computed
const dashboards = computed(() => {
  return dashboardStore.dashboards
})
// methods
function propertySelected(prop: Property, data: IDashboard) {
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
function deleteDashboard() {
  dashboardService.deleteDashboard(page.value.selected?.id!)
  page.value.selected = undefined
  page.value.showModal = false
}
// lifeCycle
// watch
onMounted(() => {
  dashboardStore.fetchDashboards()
})
</script>

<style scoped></style>
