import { defineStore } from 'pinia'
import axios, { type CancelToken, type CancelTokenSource } from 'axios'

interface State {
  Tokens: { [id: string]: CancelTokenSource }
}
//cancel store for axios request
export const useRequest = defineStore({
  id: 'useRequest',
  state: (): State => ({
    Tokens: {},
  }),
  getters: {
    loading(): boolean {
      return true
    },
  },
  actions: {
    create(requestID: string): CancelToken {
      if (this.Tokens[requestID]) {
        this.cancel(requestID)
      }
      this.Tokens[requestID] = axios.CancelToken.source()
      return this.Tokens[requestID].token
    },
    get(requestID: string): CancelToken {
      return this.Tokens[requestID].token
    },
    delete(requestID: string) {
      delete this.Tokens[requestID]
    },
    cancel(requestID: string): void {
      if (this.Tokens[requestID]) {
        this.Tokens[requestID].cancel(
          `request ${requestID} canceled by the user`
        )
        delete this.Tokens[requestID]
      }
    },
    cancelAll(): void {
      Object.keys(this.Tokens).forEach((requestID) => {
        this.Tokens[requestID].cancel(
          ` request ${requestID} canceled by the user`
        )
        delete this.Tokens[requestID]
      })
    },
  },
})
