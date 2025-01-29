import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'
import type { IAlert } from '@/model/gui/alert'
import { defineStore } from 'pinia'

interface State {
  _show: boolean
  _alert: IAlert | undefined
  _alerts: IAlert[]
}

export const useGUIAlert = defineStore('alerGUItStore', {
  state: (): State => ({
    _show: false,
    _alert: undefined,
    _alerts: [],
  }),
  getters: {
    have(): boolean {
      return this._show
    },
    alert(): IAlert {
      if (!this._alert) return {} as IAlert
      return this._alert
    },
    alerts(): IAlert[] {
      return this._alerts
    },
  },
  actions: {
    stack() {
      if (!this._alert) return
      this._alerts.push(this._alert)
    },
    setError(text: string, title?: string) {
      this.stack()
      this._show = false
      this._alert = {
        icon: EIcon.Cancel,
        color: EColor.Danger,
        text: text,
        title: title,
      }
      this._show = true
    },
    reset() {
      this._show = false
      this._alert = undefined
    },
  },
})
