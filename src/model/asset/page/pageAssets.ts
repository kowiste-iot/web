import { EIcon } from '@/enums/gui/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'

export class AssetsPage {
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
    this.title = t('asset.title')
    this.properties = [
      {
        id: 1,
        icon: EIcon.Edit,
        name: 'Edit',
      },
      {
        id: 2,
        icon: EIcon.Delete,
        name: 'Delete',
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
      name: new Columns(t('asset.table.name'), 'name'),
      asset: new Columns(t('asset.table.parent'), 'parent'),
    }
  }
}
