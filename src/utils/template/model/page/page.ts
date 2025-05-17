import { Columns } from '@/features/shared/domain/column'
import { Tab } from '@/features/shared/domain/tab'
import type { Path } from '@/features/shared/domain/path'

export class ElementPage {
  title: string
  path: Path[]
  selected: number
  tabs: Tab[]
  table: {
    id: Columns
    type: Columns
    enabled: Columns
    updated: Columns
  }

  constructor() {
    this.title = 'Element'
    this.path = [{ name: 'asset', path: '/asset' }]
    this.selected = 1
    this.tabs = [
      new Tab(1, 'type', true),
      new Tab(2, 'other'),
      new Tab(3, 'more'),
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
  changeTab(tabID: number) {
    this.tabs.forEach((tab: Tab) => {
      if (tab.id == tabID) {
        tab.selected = true
        this.selected = tab.id
      } else tab.selected = false
    })
  }
  columnsName(): Columns[] {
    return Object.values(this.table)
  }
}
