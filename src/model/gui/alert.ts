import type { EColor } from '@/enums/gui/EColor'
import type { EIcon } from '@/enums/gui/EIcon'

export interface IAlert {
  icon: EIcon
  color: EColor
  title?: string
  text: string
}
