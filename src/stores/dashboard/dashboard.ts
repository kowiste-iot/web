import type { IDashboard } from '@/model/dashboard/dashboard'
import type { FormDashboard } from '@/model/dashboard/form/form'
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
    create(data: FormDashboard) {
      this._dashboards.push({
        id: String(this._dashboards.length),
        name: data.name,
        parent: data.parent,
      })
    },
    update(data: FormDashboard) {
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
