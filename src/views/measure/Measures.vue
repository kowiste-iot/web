<template>
  <div class="mt-5">
    <TabletCard :onAdd="() => console.log('dde')">
      <DataTable
        :value="[{name:'ter'}, {name:'fgsf'}]"      
        paginator
        :rows="10"
        :pt="{
          table: 'table table-striped ',
        }"
      >
        <Column field="name" header="test"></Column>
        <Column field="other" header="other"></Column>
      </DataTable>
    </TabletCard>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
import TabletCard from '@/components/cards/TabletCard.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// model imports
// other imports
// props
// data
// storage calls
useBreadCrumb().set('measures')
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
