<template>
  <DataTable
    v-bind="$attrs"
    :size="size"
    :striped-rows="stripedRows"
    :paginator="paginator"
    :rows="rows"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    :always-show-paginator="alwaysShowPaginator"
    :table-style="tableStyle"
  >
    <slot></slot>
    <template #paginatorcontainer="slotProps: any">
      <Flex class="pagination-table" :justify="EFlexJustify.Between" :gap="1">
        <Button
          compact
          :color="EColor.Secondary"
          @click="slotProps.firstPageCallback"
          ><<</Button
        >
        <Button
          compact
          :color="EColor.Secondary"
          @click="slotProps.prevPageCallback"
          ><</Button
        >
        <span class="mx-3"
          >Page {{ slotProps.page + 1 }} of {{ slotProps.pageCount }}</span
        >
        <Button
          compact
          :color="EColor.Secondary"
          @click="slotProps.nextPageCallback"
          >></Button
        >
        <Button
          compact
          :color="EColor.Secondary"
          @click="slotProps.lastPageCallback"
          >>></Button
        >
      </Flex>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import { EColor } from '@/features/shared/enum/EColor'
import Flex from '../layout/Flex.vue'
import Button from '../buttons/Button.vue'
import { EFlexJustify } from '../layout/EFlex'
import { ref } from 'vue'

// Define explicit types for PrimeVue DataTable Paginator props
// This helps TypeScript understand what's in the slot props
declare module 'primevue/datatable' {
  interface DataTablePaginatorTemplateOptions {
    first: number
    last: number
    rows: number
    totalRecords: number
    page: number
    pageCount: number
    prevPageCallback: () => void
    nextPageCallback: () => void
  }
}

interface Props {
  size?: 'small' | 'large' | undefined
  stripedRows?: boolean
  paginator?: boolean
  rows?: number
  alwaysShowPaginator?: boolean
  tableStyle?: object
}
const render = ref(true)
const props = withDefaults(defineProps<Props>(), {
  size: 'small',
  stripedRows: false,
  paginator: true,
  rows: 10,
  alwaysShowPaginator: false,
  tableStyle: () => ({ 'min-width': '5rem' }),
})
</script>

<style>
.pagination-table {
  margin-top: var(--size-100);
}
/* Reset all borders in the datatable */
.p-datatable,
.p-datatable * {
  border: none !important;
}

/* Table header styling */
.p-datatable .p-datatable-header {
  color: var(--layout-overlay);
  font-weight: bold;
  border: none !important;
}

/* Table header cells styling */
.p-datatable .p-datatable-thead > tr > th {
  color: var(--text-color);
  border-bottom: var(--border-width) solid var(--border-color) !important;
  background-color: transparent !important;
}

/* Even row styling */
.p-datatable .p-datatable-tbody > tr.p-datatable-row-even {
  background-color: var(--layout-overlay);
}

/* Odd row styling */
.p-datatable .p-datatable-tbody > tr.p-datatable-row-odd {
  background-color: var(--layout-overlay-hovered);
}
.p-datatable .p-datatable-tbody > tr > td {
  border-bottom: var(--border-width) solid var(--border-color) !important;
}
/* Row hover effect */
.p-datatable .p-datatable-tbody > tr:hover {
  background-color: var(--layout-overlay-hovered);
}

/* Striped rows styling */
.p-datatable.p-datatable-striped .p-datatable-tbody > tr.p-row-even {
  background-color: rgba(from var(--color-brand-primary-default) r g b / 0.1);
}

/* Target the actual sort icons more specifically */
.p-datatable .p-datatable-column-header-content svg {
  /* background-color: var(--color-brand-secondary-default); */
  color: var(--button-color-text);
  padding: var(--size-050);
  border-radius: var(--border-sm);
}
.p-datatable .p-datatable-column-header-content svg:hover {
  background-color: var(--color-brand-secondary-dark);
}
.p-datatable .p-datatable-column-header-content svg:active {
  background-color: var(--color-brand-secondary-darkest);
}
</style>
