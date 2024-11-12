import { EIcon } from '@/enums/gui/EIcon'
import type { Path } from '@/model/path'
import type { Property } from '@/model/property'

export class DashboardPage {
  title: string
  path: Path[]
  selected: number
  properties: Property[]
  refresh: boolean
  show: boolean
  unlock: boolean

  constructor() {
    this.title = 'dashboard'
    this.path = [{ name: 'dashboards', path: 'dashboard' }]
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
