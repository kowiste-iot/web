import { EWidget } from '@/features/dashboard/domain/EWidget'
import { EIcon } from '@/features/shared/enum/EIcon'

export interface IWidgetType {
  id: EWidget
  name: string
  description: string
  icon: EIcon
}

export class WidgetType implements IWidgetType {
  id: EWidget = EWidget.None
  name: string = ''
  description: string = ''
  icon: EIcon = EIcon.Cancel
  constructor(data?: IWidgetType) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.description = data.description
      this.icon = data.icon
    }
  }
  get(): IWidgetType {
    return this
  }
}
