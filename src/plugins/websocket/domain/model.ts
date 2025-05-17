export enum EConnectionStatus {
  Open = 'open',
  Close = 'close',
}
export interface IWebsocketOption {
  log: boolean
  protocols?: string | string[]
}

export class WebsocketMessage implements IWebsocketMessage {
  type: EWebsocketMessageType
  content: any
  constructor(type: EWebsocketMessageType, data: any) {
    this.type = type
    this.content = data
  }
  toJSON(): IWebsocketMessage {
    return this
  }
}

export interface IWebsocketMessage {
  type: EWebsocketMessageType
  content: any
}

export enum EWebsocketMessageType {
  Subscribe = 'subscribe',
  UnSubscribe = 'unsubscribe',
  MeasureUpdate = 'measure_update',
}
