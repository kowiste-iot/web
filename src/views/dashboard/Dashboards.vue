<template>
  <TabletCard class="mt-5">
    <DataTable
      :value="[
        { name: 'ter', art: 'gtht' },
        { name: 'fgsf', art: 'ggg' },
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
      <Column :class="'text-center'" field="name" sortable>
        <template #header>
          <span class="container-fluid text-center">{{ 'hello' }}</span>
        </template>
      </Column>
      <Column :class="'text-center'" field="art">
        <template #header>
          <span class="container-fluid text-center">{{ 'other' }}</span>
        </template>
      </Column>
    </DataTable>
  </TabletCard>
  <div class="bg-danger">zdfsv</div>
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
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
// components import
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props
// data
const show = ref(false)

// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
.ui-paginator {
  font-family: verdana;
  font-weight: bold;
}

.ui-paginator {
  text-align: right !important;
}

.ui-paginator span {
  text-align: left !important;
}
.ui-paginator-pages .ui-paginator-page {
  background: none;
  background-color: #cccccc;
}
.ui-paginator-pages .ui-state-active {
  background-color: white;
}
.ui-paginator-pages .ui-state-hover {
  background-color: red;
}
</style>
