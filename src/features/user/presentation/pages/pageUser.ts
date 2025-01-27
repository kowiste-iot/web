import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/model/path'
import type { IUser } from '@/features/user/domain/user'
import { Columns } from '@/model/gui/column'
import { EIcon } from '@/features/shared/enum/EIcon'

export class UserPage extends PageBase {
  properties: Property[]
  selected?: IUser
  showForm: boolean
  editForm: boolean
  showModal: boolean
  showPreferencesForm: boolean
  showSettingsForm: boolean
  currentUser?: IUser
  table: {
    id: Columns
    name: Columns
    asset: Columns
  }
  constructor() {
    const { t } = useI18n()
    super(t('user.title'), new Array<Path>())

    this.showPreferencesForm = false
    this.showSettingsForm = false
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
    this.showPreferencesForm = false
    this.showSettingsForm = false
    this.currentUser = undefined
    this.showForm = false
    this.editForm = false
    this.showModal = false
    this.selected = undefined
  }
  private createTable() {
    const { t } = useI18n()

    return {
      id: new Columns('ID', 'id'),
      name: new Columns(t('asset.table.name'), 'name'),
      asset: new Columns(t('asset.table.parent'), 'parentName'),
    }
  }
}
