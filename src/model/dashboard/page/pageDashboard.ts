import { EIcon } from '@/enums/gui/EIcon'
import { Columns } from '@/model/gui/column'
import { Tab } from '@/model/gui/tab'
import type { Path } from '@/model/path'
import type { Property } from '@/model/property'

export class DashboardPage {
  title: string
  path: Path[]
  selected: number
  widgetProp: Property[]
  table: {
    id: Columns
    type: Columns
    enabled: Columns
    updated: Columns
  }

  constructor() {
    this.title = 'dashboard'
    this.path = [{ name: 'dashboards', path: 'dashboard' }]
    this.selected = 1
    this.widgetProp = [
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

    this.table = this.createTable()
  }

  private createTable() {
    return {
      id: new Columns('ID', 'id'),
      type: new Columns('Type', 'name'),
      enabled: new Columns('Enabled', 'enabled'),
      updated: new Columns('Updated', 'updatedDisplay'),
    }
  }

  columnsName(): Columns[] {
    return Object.values(this.table)
  }
}
