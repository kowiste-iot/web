// plugin.ts
import { type App, type Plugin } from 'vue'
import { type IWebsocketOption } from '../domain/model'
import { useWebsocketStore } from '../store/store'

export const WebsocketPlugin: Plugin = {
  install(app: App, options?: IWebsocketOption) {
    // Only register the plugin, but don't initialize the service yet
    const ws = useWebsocketStore()
    if (options) ws.setOptions(options)

    // Make the store available globally
    app.config.globalProperties.$websocket = ws
  },
}

// Export an initialization function to be called after authentication
export const initializeWebsocketService = () => {
  const ws = useWebsocketStore()
  // Now the store will create a new instance of the service with proper tenant/branch
  ws.initializeService()
}
