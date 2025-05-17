<template>
  <Card class="mt-5">
    <CardHeader
      :headerIcon="EIcon.Dashboard"
      :headerText="'Dasnboard'"
      :buttonText="'Dashboard'"
      @click="() => (page.showForm = true)"
    />
    <DataTable :value="dashboards">
      <Column style="width: 5px">
        <template #body="{ data }">
          <Button :color="EColor.Primary" small @click="goTo(data.id)">{{
            $t('dashboard.goto')
          }}</Button>
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
            @click="(prop:Property)=>propertySelected(prop,data)"
          />
        </template>
      </Column>
    </DataTable>
  </Card>

  <Modal v-if="page.showForm" @cancel="closeForm">
    <SideCard :size="4">
      <DashboardForm
        :data="page.selected"
        :edit="page.editForm"
        @close="closeForm"
      />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('actionGUI.delete')"
    @action="deleteDashboard"
    @cancel="
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
import { computed, onMounted, reactive } from 'vue'
// stores import

// components import
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
import type { Property } from '@/features/shared/domain/property'
import { EActionGUI } from '@/features/shared/domain/EActionGUI'
import { DashboardsPage } from '@/features/dashboard/presentation/pages/pageDashboards'
import Modal from '@/components/layout/Modal.vue'
import type { IDashboard } from '@/features/dashboard/domain/dashboard'
import { useDashboardStore } from '@/features/dashboard/stores/useDashboardStore'
import { DashboardService } from '@/features/dashboard/application/dashboardService'
import { DashboardRepository } from '@/features/dashboard/repository/dashboardRepository'
import { useBasePage } from '@/composable/useBasePage'
import Card from '@/components/cards/Card.vue'
import CardHeader from '@/components/cards/CardHeader.vue'
// other imports
// props
// data
const page = reactive(new DashboardsPage())
// service
const { notificationService } = useBasePage(page.title)
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
async function deleteDashboard() {
  await dashboardService.deleteDashboard(page.selected?.id!)
  await refreshData()
  page.selected = undefined
  page.showModal = false
}
function goTo(id: string) {
  getRouter().push('/dashboard/' + id)
}
function closeForm() {
  refreshData()
  page.reset()
}
async function refreshData() {
  await dashboardStore.fetchDashboards()
}
// lifeCycle
onMounted(() => {
  refreshData()
})
// watch
</script>

<style scoped></style>
