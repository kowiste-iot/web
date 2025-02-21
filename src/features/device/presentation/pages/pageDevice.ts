import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/model/path'
import type { IDevice } from '../../domain/device'

export class DevicePage extends PageBase {
  properties: Property[]
  selected?: IDevice
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    id: Columns
    name: Columns
    asset: Columns
    description: Columns
  }

  constructor() {
    const { t } = useI18n()
    super(t('device.title'), new Array<Path>())

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
    this.editForm = false
    this.showModal = false
    this.table = this.createTable()
  }
  reset() {
    this.showForm = false
    this.editForm = false
    this.showModal = false
    this.selected = undefined
  }
  private createTable() {
    const { t } = useI18n()

    return {
      id: new Columns('ID', 'id'),
      name: new Columns(t('device.table.name'), 'name'),
      asset: new Columns(t('device.table.parent'), 'parentName'),
      description: new Columns(t('device.table.description'), 'description'),
    }
  }
}
