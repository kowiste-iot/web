import type { EIcon } from '@/enums/gui/EIcon'

export interface IWidget {
  id: number
  name: string
  description: string
  icon: EIcon
}

export class Widget implements IWidget {
  id: number
  name: string
  description: string
  icon: EIcon
  constructor(data: IWidget) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.icon = data.icon
  }
  get(): IWidget {
    return this
  }
}
