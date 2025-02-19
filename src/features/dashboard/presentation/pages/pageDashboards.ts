import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/model/path'
import type { IDashboard } from '@/features/dashboard/domain/dashboard'

export class DashboardsPage extends PageBase {
  properties: Property[]
  selected?: IDashboard
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    id: Columns
    name: Columns
    asset: Columns
  }

  constructor() {
    const { t } = useI18n()
    super(t('dashboard.title'), new Array<Path>())
    this.properties = [
      {
        id: 1,
        icon: EIcon.Edit,
        name: t('actionGUI.edit'),
      },
      {
        id: 2,
        icon: EIcon.Delete,
        name: t('actionGUI.delete'),
      },
    ]
    this.showForm = false
    this.editForm = false
    this.showModal = false
    this.table = this.createTable()
  }

  private createTable() {
    const { t } = useI18n()
    return {
      id: new Columns('ID', 'id'),
      name: new Columns(t('dashboard.table.name'), 'name'),
      asset: new Columns(t('dashboard.table.parent'), 'parent'),
    }
  }
  reset() {
    this.showForm = false
    this.editForm = false
  }
}
