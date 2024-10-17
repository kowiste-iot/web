import { EIcon } from '@/enums/gui/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'

export class DashboardsPage {
  title: string
  properties: Property[]
  showForm: boolean
  showModal: boolean
  table: {
    id: Columns
    name: Columns
    asset: Columns
  }

  constructor() {
    const { t } = useI18n()
    this.title = 'dashboards'
    this.properties = [
      {
        id: 1,
        icon: EIcon.Edit,
        name: t('action.edit'),
      },
      {
        id: 2,
        icon: EIcon.Delete,
        name: t('action.delete'),
      },
    ]
    this.showForm = false
    this.showModal = false
    this.table = this.createTable()
  }

  private createTable() {
    const { t } = useI18n()
    return {
      id: new Columns('ID', 'id'),
      name: new Columns('Name', t('dashboard.table.name')),
      asset: new Columns('Asset', t('dashboard.table.asset')),
    }
  }
}
