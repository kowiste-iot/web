import type { IDashboard } from '@/model/dashboard/dashboard'
import type {
  FormDashboard,
  IFormDashboard,
} from '@/model/dashboard/form/formDashboard'
import { defineStore } from 'pinia'

interface State {
  _dashboards: IDashboard[]
}

export const useDashboard = defineStore('dashboardstore', {
  state: (): State => ({
    _dashboards: [],
  }),
  getters: {
    dashboards(): IDashboard[] {
      return this._dashboards
    },
  },
  actions: {
    create(data: IFormDashboard) {
      this._dashboards.push({
        id: String(this._dashboards.length),
        name: data.name,
        parent: data.parent,
      })
    },
    update(data: IFormDashboard) {
      const indexDashboard = this._dashboards.findIndex(
        (dashboard) => dashboard.id == data.id
      )
      if (indexDashboard < 0) return
      this._dashboards[indexDashboard] = data
    },
    delete(data: IDashboard) {
      this._dashboards = this._dashboards.filter((dashboard) => {
        return dashboard.id != data.id
      })
    },
  },
})
