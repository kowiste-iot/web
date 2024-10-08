<template>
  <div class="mt-5">
    <TabletCard>
      <DataTable
        :value="[{ name: 'ter' }, { name: 'fgsf' }]"
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
  </div>
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

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props
// data
const show = ref(false)
// storage calls
useBreadCrumb().set('measures')
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
