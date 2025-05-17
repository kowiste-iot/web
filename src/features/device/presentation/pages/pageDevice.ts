import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/features/shared/domain/column'
import type { Property } from '@/features/shared/domain/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import type { IDevice, IDevicePassword } from '../../domain/device'

export class DevicePage extends PageBase {
  properties: Property[]
  selected?: IDevice
  showForm: boolean
  editForm: boolean
  showModal: boolean
  showModalPassword: boolean
  devicePassword?: IDevicePassword
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
    this.showModalPassword = false
    this.table = this.createTable()
  }
  reset() {
    this.showForm = false
    this.editForm = false
    this.showModal = false
    this.showModalPassword = false
    this.devicePassword = undefined
    this.selected = undefined
  }
  propertySelected(id: number, data: IDevice) {
    this.selected = data
    switch (id) {
      case 1:
        this.showForm = true
        this.editForm = true
        break
      case 2:
        this.showModal = true
        break
    }
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
