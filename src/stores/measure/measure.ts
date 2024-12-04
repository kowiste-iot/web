import type {
  FormMeasure,
  IFormMeasure,
} from '@/model/measure/form/formMeasure'
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
    create(data: IFormMeasure) {
      this._measures.push({
        id: data.id,
        name: data.name,
        parent: data.parent,
      })
    },
    update(data: IFormMeasure) {
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
