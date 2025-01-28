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
  }

  reset() {
    this.showForm = false
    this.editForm = false
    this.showModal = false
    this.selected = undefined
  }


}
