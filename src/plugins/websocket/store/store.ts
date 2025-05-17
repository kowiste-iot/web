// store.ts
import { defineStore } from 'pinia'
import {
  EConnectionStatus,
  type IWebsocketMessage,
  type IWebsocketOption,
} from '../domain/model'
import { WebsocketService } from '../application/service'

interface State {
  websocketService: WebsocketService | null
  options?: IWebsocketOption
  isInitialized: boolean
  msgHandlers: { [key: string]: Function }
}

export const useWebsocketStore = defineStore('websocket', {
  state: (): State => ({
    websocketService: null,
    options: undefined,
    isInitialized: false,
    msgHandlers: {},
  }),

  actions: {
    // Initialize the service when tenant and branch are available
    initializeService() {
      if (this.isInitialized) return

      // Create new instance of WebsocketService
      this.websocketService = new WebsocketService(this.options)
      this.isInitialized = true

      if (this.options) {
        this.websocketService.setOptions(this.options)
      }
    },

    async getURL() {
      if (!this.websocketService) {
        throw new Error(
          'WebSocket service not initialized. Call initializeService first.'
        )
      }
      return await this.websocketService.getURL()
    },

    async connect() {
      if (!this.websocketService) {
        throw new Error(
          'WebSocket service not initialized. Call initializeService first.'
        )
      }
      await this.websocketService.connectWithToken(this.onMessage)
    },

    send(data: any) {
      if (!this.websocketService) {
        throw new Error(
          'WebSocket service not initialized. Call initializeService first.'
        )
      }
      this.websocketService.send(data)
    },
    onMessage(msg: IWebsocketMessage) {
      //call the function for that type oof message
      if (this.msgHandlers[msg.type]) this.msgHandlers[msg.type](msg.content)
    },
    //add a message callback
    addmsgHandler(typeMessage: string, fn: Function) {
      this.msgHandlers[typeMessage] = fn
    },
    removemsgHandler(typeMessage: string, fn: Function) {
      this.msgHandlers[typeMessage] = fn
    },
    disconnect() {
      if (!this.websocketService) return
      this.websocketService.disconnect()
    },

    onConnect(connectFunc: (data: any) => void) {
      if (!this.websocketService) {
        throw new Error(
          'WebSocket service not initialized. Call initializeService first.'
        )
      }
      this.websocketService.onConnect(connectFunc)
    },

    onClose(closeFunc: (data: any) => void) {
      if (!this.websocketService) {
        throw new Error(
          'WebSocket service not initialized. Call initializeService first.'
        )
      }
      this.websocketService.onClose(closeFunc)
    },

    onError(errorFunc: (error: any) => void) {
      if (!this.websocketService) {
        throw new Error(
          'WebSocket service not initialized. Call initializeService first.'
        )
      }
      this.websocketService.onError(errorFunc)
    },

    setOptions(data: IWebsocketOption) {
      this.options = data
      if (this.websocketService) {
        this.websocketService.setOptions(data)
      }
    },
  },

  getters: {
    url(): string {
      if (!this.websocketService) return ''
      return this.websocketService.getWebsocketUrl()
    },
    status(): EConnectionStatus {
      if (!this.websocketService) return EConnectionStatus.Close
      return this.websocketService.getStatus()
    },
    isReady(): boolean {
      return this.isInitialized && !!this.websocketService
    },
  },
})
