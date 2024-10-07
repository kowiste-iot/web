import { Columns } from '@/model/gui/column'
import { Tab } from '@/model/gui/tab'
import type { Path } from '@/model/path'

export class WidgetFormPage {
  title: string
  path: Path[]
  selected: number
  tabs: Tab[]
  constructor() {
    this.title = 'Select a widget'
    this.path = [{ name: 'asset', path: '/asset' }]
    this.selected = 1
    this.tabs = [new Tab(1, 'type', true), new Tab(2, 'options')]
  }
  changeTab(tabID: number) {
    this.tabs.forEach((tab: Tab) => {
      if (tab.id == tabID) {
        tab.selected = true
        this.selected = tab.id
      } else tab.selected = false
    })
  }
}
