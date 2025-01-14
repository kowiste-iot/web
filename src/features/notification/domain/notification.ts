import type { ENotificationType } from './notificationEnum'

export interface INotification {
  id: string
  message: string
  type: ENotificationType
  duration?: number
  createdAt: Date
}

export interface INotificationInput {
  message: string
  type: ENotificationType
  duration?: number
}



export class AppNotification implements INotification {
  readonly id: string
  readonly message: string
  readonly type: ENotificationType
  readonly duration: number
  readonly createdAt: Date

  constructor(props: INotificationInput) {
    this.id = crypto.randomUUID()
    this.message = props.message
    this.type = props.type
    this.duration = props.duration || 3000
    this.createdAt = new Date()
  }
}
