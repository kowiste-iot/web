import type { FormWidget } from '@/model/widget/form/form'
import type { IWidget } from '@/model/widget/widget'
import { defineStore } from 'pinia'

interface State {
  _widgets: IWidget[]
}

export const useWidget = defineStore('widgetStore', {
  state: (): State => ({
    _widgets: [],
  }),
  getters: {
    widgets(): IWidget[] {
      return this._widgets
    },
  },
  actions: {
    create(data: FormWidget) {
      data.id = String(this._widgets.length)
      this._widgets.push(data)
    },
    update(data: FormWidget) {
      const indexWidget= this._widgets.findIndex(
        (widget) => widget.id == data.id
      )
      if (indexWidget < 0) return
      this._widgets[indexWidget] = data
    },
    delete(data: IWidget) {
      this._widgets = this._widgets.filter((widget) => {
        return widget.id != data.id
      })
    },
  },
})
