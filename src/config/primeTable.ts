// src/plugins/primevue.ts
import { type PrimeVueConfiguration } from 'primevue/config'
import DataTable from 'primevue/datatable'

export const primevueConfig: PrimeVueConfiguration = {
  ripple: true,
  // Add other PrimeVue global configs here
}

// Define default props for DataTable
DataTable.props = {
  ...DataTable.props,
  size: {
    type: String,
    default: 'small',
  },
  stripedRows: {
    type: Boolean,
    default: true,
  },
  paginator: {
    type: Boolean,
    default: true,
  },
  rows: {
    type: Number,
    default: 10,
  },
  alwaysShowPaginator: {
    type: Boolean,
    default: false,
  },
  paginatorTemplate: {
    type: String,
    default: ' FirstPageLink PrevPageLink CurrentPageReport NextPageLink ',
  },
  currentPageReportTemplate: {
    type: String,
    default: '{first} to {last} of {totalRecords}',
  },
  tableStyle: {
    type: Object,
    default: () => ({ 'min-width': '5rem' }),
  },
}
