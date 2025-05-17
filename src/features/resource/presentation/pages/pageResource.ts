import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/features/shared/domain/column'
import type { Property } from '@/features/shared/domain/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import type { IResource } from '@/features/resource/domain/resource'

export class ResourcesPage extends PageBase {
  properties: Property[]
  selected?: IResource
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    name: Columns
    scopes: Columns
  }

  constructor() {
    const { t } = useI18n()
    super(t('resource.title'), new Array<Path>())

    this.properties = [
      {
        id: 1,
        icon: EIcon.Edit,
        name: 'Edit',
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
      name: new Columns(t('resource.table.name'), 'displayName'),
      scopes: new Columns(t('resource.table.scopes'), 'scopes'),
    }
  }
}
