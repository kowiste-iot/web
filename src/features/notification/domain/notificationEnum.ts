import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'

export enum ENotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface NotificationGUI {
  icon: EIcon
  color: EColor
}

export const notificationMap: { [key in ENotificationType]: NotificationGUI } =
  {
    [ENotificationType.SUCCESS]: {
      icon: EIcon.Success,
      color: EColor.Success,
    },
    [ENotificationType.ERROR]: {
      icon: EIcon.Cancel,
      color: EColor.Danger,
    },
    [ENotificationType.WARNING]: {
      icon: EIcon.Warning,
      color: EColor.Warning,
    },
    [ENotificationType.INFO]: {
      icon: EIcon.Info,
      color: EColor.Info,
    },
  }
