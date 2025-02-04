import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Columns } from '@/model/gui/column'
import { Tab } from '@/model/gui/tab'

export class ActionPage extends PageBase {
  selected: number
  tabs: Tab[]
  table: {
    id: Columns
    type: Columns
    enabled: Columns
    updated: Columns
  }

  constructor() {
    super('action', [{ name: 'process', path: 'process' }])
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
