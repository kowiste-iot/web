import { Columns } from '@/model/column'
import type { Path } from '@/model/path'

export class ElementPage {
  title: string
  path: Path[]
  table: {
    id: Columns
    type: Columns
    enabled: Columns
    updated: Columns
  }
  constructor() {
    this.title = 'Element'
    this.path = [{ name: 'asset', path: '/asset' }]
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