import { EIcon } from '@/enums/gui/EIcon'
import { PageBase } from '@/model/base/pageBase'
import type { Path } from '@/model/path'
import type { Property } from '@/model/property'

export class DashboardPage extends PageBase {
  selected: number
  properties: Property[]
  refresh: boolean
  show: boolean
  unlock: boolean

  constructor() {
    super('dashboard', [{ name: 'dashboards', path: 'dashboard' }])
    this.selected = 1
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
    this.refresh = true
    this.show = false
    this.unlock = false
  }
}
