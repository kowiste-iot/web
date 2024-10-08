import { EColor } from '@/enums/gui/EColor'
import type { EIcon } from '@/enums/gui/EIcon'
import { ENotificationSeverity } from '@/enums/notification/ENotificationSeverity'

export interface INotification {
  id: string
  icon: EIcon
  msg: string
  severity: ENotificationSeverity
}

export class Notification implements INotification {
  id: string
  icon: EIcon
  msg: string
  severity: ENotificationSeverity

  constructor(data: INotification) {
    this.id = data.id
    this.icon = data.icon
    this.msg = data.msg
    this.severity = data.severity
  }

  get(): INotification {
    return this
  }
  
  severityColor(): EColor {
    switch (this.severity) {
      case ENotificationSeverity.VeryLow:
        return EColor.Primary
      case ENotificationSeverity.Low:
        return EColor.Success
      case ENotificationSeverity.Normal:
        return EColor.Secondary
      case ENotificationSeverity.High:
        return EColor.Warning
      case ENotificationSeverity.VeryHigh:
        return EColor.Danger
    }
  }
}
