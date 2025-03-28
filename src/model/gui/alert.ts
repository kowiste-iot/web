import type { EColor } from '@/features/shared/enum/EColor'
import type { EIcon } from '@/features/shared/enum/EIcon'

export interface IAlertGUI {
  icon: EIcon
  color: EColor
  title?: string
  text: string
}
