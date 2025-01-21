// features/resource/presentation/pages/pageResources.ts
import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/model/path'
import type { IResource } from '@/features/resource/domain/resource'

export class ResourcesPage extends PageBase {
  properties: Property[]
  selected?: IResource
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    name: Columns
    type: Columns
    displayName: Columns
    uris: Columns
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
      type: new Columns(t('resource.table.type'), 'type'),
      displayName: new Columns(t('resource.table.displayName'), 'displayName'),
      uris: new Columns(t('resource.table.uris'), 'uris'),
      scopes: new Columns(t('resource.table.scopes'), 'scopes'),
    }
  }
}
