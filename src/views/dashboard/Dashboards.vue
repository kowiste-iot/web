<template>
  <TabletCard class="mt-5">
    <DataTable
      :value="[
        { id: 'sdff231', name: 'ter', asset: 'gtht' },
        { id: 'sfgf231', name: 'fgsf', art: 'ggg' },
      ]"
      :tableStyle="{ 'min-width': '5rem' }"
      size="small"
      paginator
      :rows="5"
      :pt="{
        table: 'table table-striped',
        pcPaginator: 'btn bg-danger border border-danger',
      }"
    >
      <Column style="width: 5px">
        <template #body="{ data }">
          <Button
            :color="EColor.Primary"
            small
            @click="router.push('/dashboard/' + data.id)"
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
        <template #body>
          <PropertyDot :data="page.properties" :onClick="propertySelected" />
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
      <DashboardForm :close="() => (page.showForm = false)" />
    </SideCard>
  </Modal>

  <ConfirmCard
    v-if="page.showModal"
    :action="EActionGUI.Danger"
    :actionText="$t('action.delete')"
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
import { ref } from 'vue'
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from '@/components/buttons/Button.vue'
import SideCard from '@/components/cards/SideCard.vue'
import DashboardForm from '@/views/dashboard/form/DashboardForm.vue'
import PropertyDot from '@/components/property/Property.vue'
import ConfirmCard from '@/components/cards/ConfirmCard.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import router from '@/router'
import type { Property } from '@/model/property'
import { EActionGUI } from '@/enums/gui/EActionGUI'
import { DashboardsPage } from '@/model/dashboard/page/pageDashboards'
import Modal from '@/components/cards/Modal.vue'
// other imports
// props
// data
const page = ref(new DashboardsPage())

// storage calls
useBreadCrumb().set(page.value.title)

// computed
// methods
function propertySelected(data: Property) {
  switch (data.id) {
    case 2:
      page.value.showModal = true
      break

    default:
      break
  }
}
// lifeCycle
// watch
</script>

<style scoped></style>
