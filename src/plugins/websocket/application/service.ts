import { BaseRepository } from '@/features/shared/domain/baseRepository'
import { EConnectionStatus, type IWebsocketOption } from '../domain/model'
import axiosClient from '@/utils/http/axios-client'
import { useTenant } from '@/composable/useTenant'
import { URLParams } from '@/utils/http/url/params'
import { useSessionStore } from '@/features/session/store/useSessionStore'
import logger from '@/utils/log/logger'

interface TokenURL {
  url: string
}

export class WebsocketService extends BaseRepository {
  private websocket: WebSocket | undefined
  private options?: IWebsocketOption
  private onConnectCallback?: (data: any) => void
  private onCloseCallback?: (data: any) => void
  private onErrorCallback?: (err: any) => void
  private onMessageCallback?: Function
  private status: EConnectionStatus = EConnectionStatus.Close
  private urlWS: string | null = null

  constructor(options?: IWebsocketOption) {
    super('ws')
    if (options) this.options = options
  }

  /**
   * Get WebSocket URL with token
   * This fetches the token from the API and returns the WebSocket URL
   */
  async getURL(): Promise<string> {
    try {
      const response = await axiosClient().post<TokenURL>(
        `${this.baseUrl}/token`
      )
      this.urlWS = response.data.url
      return this.urlWS
    } catch (error) {
      logger.error('Failed to fetch WebSocket token:', error)
      throw error
    }
  }

  /**
   * Connect to WebSocket with optional URL
   * If URL is not provided, it will use getURL() to fetch one with a token
   */
  async connectWithToken(onMessage: Function): Promise<void> {
    const url = await this.getURL()
    this.connect(url, onMessage)
  }

  connect(url: string, onMessage: Function): void {
    if (this.websocket?.OPEN) this.websocket?.close()

    //get tenant and branch
    const { getTenantId } = useTenant()
    const param = new URLParams()
    const branch = useSessionStore().getCurrentBranch
    param.setParams('tenant', getTenantId())
    param.setParams('branch', branch)

    this.websocket = new WebSocket(param.setURL(url), this.options?.protocols)
    this.onMessageCallback = onMessage

    this.websocket.onopen = (data: any) => {
      if (this.options?.log) logger.debug('websocket open', data)
      this.status = EConnectionStatus.Open
      if (this.onConnectCallback) this.onConnectCallback(data)
    }

    this.websocket.onmessage = (event: MessageEvent) => {
      if (this.options?.log) logger.debug('Message from server:', event)
      const message = JSON.parse(event.data)
      if (this.onMessageCallback) {
        ;(this.onMessageCallback as Function)(message)
      }
    }

    this.websocket.onclose = (event) => {
      if (this.options?.log) logger.debug('WebSocket is closed now.')
      this.status = EConnectionStatus.Close
      if (this.onCloseCallback) this.onCloseCallback(event)
    }

    this.websocket.onerror = (error) => {
      if (this.options?.log) logger.error('WebSocket error:', error)
      if (this.onErrorCallback) this.onErrorCallback(error)
    }
  }

  send(data: any): void {
    this.websocket?.send(JSON.stringify(data))
  }

  disconnect(): void {
    if (this.websocket?.OPEN) this.websocket?.close()
    this.status = EConnectionStatus.Close
  }

  onConnect(connectFunc: (data: any) => void): void {
    this.onConnectCallback = connectFunc
  }

  onClose(closeFunc: (data: any) => void): void {
    this.onCloseCallback = closeFunc
  }

  onError(errorFunc: (error: any) => void): void {
    this.onErrorCallback = errorFunc
  }

  setOptions(data: IWebsocketOption): void {
    this.options = data
  }

  getWebsocketUrl(): string {
    if (!this.websocket) return ''
    return this.websocket.url
  }

  getStatus(): EConnectionStatus {
    return this.status
  }
}
