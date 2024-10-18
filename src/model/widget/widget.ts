import { EIcon } from '@/enums/gui/EIcon'

export interface IWidget {
  id: number
  name: string
  description: string
  icon: EIcon
}

export class Widget implements IWidget {
  id: number=0
  name: string=''
  description: string=''
  icon: EIcon=EIcon.Cancel
  constructor(data?: IWidget) {
    if (!data) return
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.icon = data.icon
  }
  get(): IWidget {
    return this
  }
}
