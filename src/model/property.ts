import { EIcon } from '@/enums/gui/EIcon'

export interface IProperty {
  id: number
  icon: EIcon
  name: string
  option?: { [key: string]: any }
}
export class Property implements IProperty {
  id: number
  icon: EIcon
  name: string
  option?: { [key: string]: any }

  constructor() {
    this.id = 0
    this.icon = EIcon.Death
    this.name = ''
    this.option = {}
  }
}
