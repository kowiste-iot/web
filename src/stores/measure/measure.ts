import type { FormMeasure } from '@/model/measure/form/form'
import type { IMeasure } from '@/model/measure/measure'
import { defineStore } from 'pinia'

interface State {
  _measures: IMeasure[]
}

export const useMeasure = defineStore('measureStore', {
  state: (): State => ({
    _measures: [],
  }),
  getters: {
    measures(): IMeasure[] {
      return this._measures
    },
  },
  actions: {
    create(data: FormMeasure) {
      this._measures.push({
        id: String(this._measures.length),
        name: data.name,
        parent: data.parent,
      })
    },
    update(data: FormMeasure) {
      const indexAsset = this._measures.findIndex(
        (measure) => measure.id == data.id
      )
      if (indexAsset < 0) return
      this._measures[indexAsset] = data
    },
    delete(data: IMeasure) {
      this._measures = this._measures.filter((measure) => {
        return measure.id != data.id
      })
    },
  },
})
