import type { Path } from '@/features/shared/domain/path'
import { defineStore } from 'pinia'

interface State {
  _path: Path[]
  _page: string
}

export const useBreadCrumb = defineStore('breadCrumbStore', {
  state: (): State => ({
    _path: [],
    _page: '',
  }),
  getters: {
    data(): { path: Path[]; page: string } {
      return { page: this._page, path: this._path }
    },
  },
  actions: {
    set(page: string, path?: Path[]) {
      this._path = []
      this._page = page
      if (path) this._path = path
    },
    reset() {
      this._page = ''
      this._path = []
    },
  },
})
