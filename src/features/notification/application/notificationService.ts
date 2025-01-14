import {
  AppNotification,
  type INotificationInput,
} from '../domain/notification'
import { ENotificationType } from '../domain/notificationEnum'
import type { NotificationStore } from '../stores/notificationStore'

export interface INotificationService {
  show(notification: INotificationInput): void
  success(message: string, duration?: number): void
  error(message: string, duration?: number): void
  warning(message: string, duration?: number): void
  info(message: string, duration?: number): void
}

export class NotificationService implements INotificationService {
  constructor(private readonly store: NotificationStore) {}

  show(notification: INotificationInput): void {
    this.store.addNotification(new AppNotification(notification))
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: ENotificationType.SUCCESS, duration })
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: ENotificationType.ERROR, duration })
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: ENotificationType.WARNING, duration })
  }

  info(message: string, duration?: number): void {
    this.show({ message, type: ENotificationType.INFO, duration })
  }
}
