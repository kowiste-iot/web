import { defineStore } from 'pinia'

interface State {
  _darkTheme: boolean
}

export const useUser = defineStore('userStore', {
  state: (): State => ({
    _darkTheme: false,
  }),
  getters: {
    darkTheme(): boolean {
      return this._darkTheme
    },
  },
  actions: {
    changeTheme() {
      this._darkTheme = !this._darkTheme
    },
  },
})
