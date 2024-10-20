import { EIcon } from '@/enums/gui/EIcon'

export interface IWidgetType {
  id: number
  name: string
  description: string
  icon: EIcon
}

export class WidgetType implements IWidgetType {
  id: number = 0
  name: string = ''
  description: string = ''
  icon: EIcon = EIcon.Cancel
  constructor(data?: IWidgetType) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.description = data.description
      this.icon=data.icon
    }
  }
  get(): IWidgetType {
    return this
  }
}
