import { EIcon } from '@/enums/gui/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'

export class AssetsPage {
  title: string
  properties: Property[]
  table: {
    id: Columns
    name: Columns
    asset: Columns
  }

  constructor() {
    this.title = 'dashboards'
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

    this.table = this.createTable()
  }

  private createTable() {
    return {
      id: new Columns('ID', 'id'),
      name: new Columns('Name', 'name'),
      asset: new Columns('Parent', 'parent'),
    }
  }
}
