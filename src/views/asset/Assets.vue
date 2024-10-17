<template>
  <TabletCard class="mt-5">
    <DataTable
      :value="[
        { id: 'sdff231', name: 'ter', art: 'gtht' },
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
      @click="() => (show = true)"
    />
  </div>
  <SideCard v-if="show" class="col-md-6">
    <DashboardForm :close="() => (show = false)" />
  </SideCard>
  <ConfirmCard
    v-if="showModal"
    :action="EActionGUI.Danger"
    actionText="Delete"
    :onCancel="
      () => {
        showModal = false
      }
    "
  >
    <div class="text-center">Are you sure you want to delete</div>
  </ConfirmCard>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import

import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
import { EActionGUI } from '@/enums/gui/EActionGUI'
import { AssetsPage } from '@/model/asset/page/pageAssets'

// other imports
// props

// data
const page = ref(new AssetsPage())
const show = ref(false)
const showModal = ref(false)
// storage calls
useBreadCrumb().set(page.value.title)

// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
