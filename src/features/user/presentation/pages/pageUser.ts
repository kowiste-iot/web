import type { Property } from '@/features/shared/domain/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import type { IUser } from '@/features/user/domain/user'
import { Columns } from '@/features/shared/domain/column'
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
    email: Columns
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
      name: new Columns(t('user.table.name'), 'fullName'),
      email: new Columns(t('user.table.email'), 'email'),
    }
  }
}
