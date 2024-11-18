// src/components/BaseDataTable.vue
<script setup lang="ts">
import DataTable from 'primevue/datatable'
interface Props {
  size?: 'small' | 'large' | undefined // Fixed: Using the correct union type
  stripedRows?: boolean
  paginator?: boolean
  rows?: number
  alwaysShowPaginator?: boolean
  paginatorTemplate?: string
  currentPageReportTemplate?: string
  tableStyle?: object
}
withDefaults(defineProps<Props>(), {
  size: 'small',
  stripedRows: true,
  paginator: true,
  rows: 5,
  alwaysShowPaginator: false,
  paginatorTemplate:
    'FirstPageLink PrevPageLink CurrentPageReport NextPageLink',
  currentPageReportTemplate: '{first} to {last} of {totalRecords}',
  tableStyle: () => ({ 'min-width': '5rem' }),
})
</script>

<template>
  <DataTable
    v-bind="$attrs"
    :size="size"
    :striped-rows="stripedRows"
    :paginator="paginator"
    :rows="rows"
    :always-show-paginator="alwaysShowPaginator"
    :paginator-template="paginatorTemplate"
    :current-page-report-template="currentPageReportTemplate"
    :table-style="tableStyle"
  >
    <slot></slot>
  </DataTable>
</template>
