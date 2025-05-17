import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/features/shared/domain/column'
import type { Property } from '@/features/shared/domain/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import type { IAsset } from '@/features/asset/domain/asset'

export class AssetsPage extends PageBase {
  properties: Property[]
  selected?: IAsset
  showForm: boolean
  editForm: boolean
  showModal: boolean
  table: {
    id: Columns
    name: Columns
    asset: Columns
  }

  constructor() {
    const { t } = useI18n()
    super(t('asset.title'), new Array<Path>())

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
  propertySelected(id: number, data: IAsset) {
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
      name: new Columns(t('asset.table.name'), 'name'),
      asset: new Columns(t('asset.table.parent'), 'parentName'),
    }
  }
}
