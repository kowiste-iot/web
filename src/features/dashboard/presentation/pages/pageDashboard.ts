import { EIcon } from '@/features/shared/enum/EIcon'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import type { Property } from '@/features/shared/domain/property'
import type { IWidget } from '../../domain/widget'

export class DashboardPage extends PageBase {
  selected?: IWidget
  properties: Property[]
  showForm: boolean
  editForm: boolean
  showModal: boolean
  refresh: boolean
  unlock: boolean

  constructor() {
    super('dashboard', [{ name: 'dashboards', path: 'dashboard' }])
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
    this.refresh = true
    this.showModal = false
    this.unlock = false
  }
  propertySelected(id: number, data: IWidget) {
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
  reset() {
    this.showForm = false
    this.editForm = false
    this.showModal = false
    this.selected = undefined
  }
}
