import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/features/shared/domain/column'
import type { Property } from '@/features/shared/domain/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import type { IAction } from '../../domain/action'

export class ActionPage extends PageBase {
  properties: Property[]
  selected?: IAction
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    name: Columns
    asset: Columns
    enabled: Columns
    description: Columns
  }

  constructor() {
    const { t } = useI18n()
    super(t('action.title'), new Array<Path>())

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
      name: new Columns(t('action.table.name'), 'name'),
      asset: new Columns(t('action.table.parent'), 'parentName'),
      enabled: new Columns(t('action.table.enabled'), 'enabled'),
      description: new Columns(t('action.table.description'), 'description'),
    }
  }
}
