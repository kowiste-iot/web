// features/role/presentation/pages/pageRoles.ts
import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/features/shared/domain/column'
import type { Property } from '@/features/shared/domain/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import type { IRole } from '@/features/role/domain/role'

export class RolesPage extends PageBase {
  properties: Property[]
  selected?: IRole
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    name: Columns
    description: Columns
  }

  constructor() {
    const { t } = useI18n()
    super(t('role.title'), new Array<Path>())

    this.properties = [
      {
        id: 1,
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
      name: new Columns(t('role.table.name'), 'name'),
      description: new Columns(t('role.table.description'), 'description'),
    }
  }
}
