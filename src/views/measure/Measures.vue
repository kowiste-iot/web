<template>
  <div>
    <TabletCard class="mt-5">
      <DataTable
        :value="[{ name: 'ter' }, { name: 'fgsf' }]"
        paginator
        :rows="10"
        :pt="{
          table: 'table table-striped',
        }"
      >
        <Column class="p-1" field="name" header="test"></Column>
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
  <SideCard v-if="show" class="col-md-4">
    <MeasureForm :close="() => (show = false)" />
  </SideCard>
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
import SideCard from '@/components/cards/SideCard.vue'
import MeasureForm from '@/views/measure/form/MeasureForm.vue'

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'
// other imports
// props
// data
const show = ref(false)
const inp = ref('')
const changeForm = ref(false)
// storage calls
useBreadCrumb().set('measures')
// computed
// methods
function onChange() {
  changeForm.value = true
}
// lifeCycle
// watch
</script>

<style scoped></style>
