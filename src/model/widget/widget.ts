import { EWidget } from '@/enums/dashboard/EWidget'

export interface IWidget {
  id: string
  name: string
  dashboardID: string
  description: string
  type: EWidget
  i: number
  x: number
  y: number
  w: number
  h: number
}

export class Widget implements IWidget {
  id: string = ''
  name: string = ''
  dashboardID: string = ''
  description: string = ''
  type: EWidget = EWidget.Boolean
  i: number = 0
  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0
  constructor(data?: IWidget) {
    if (!data) return
    this.id = data.id
    this.name = data.name
    this.dashboardID = data.dashboardID
    this.description = data.description
    this.type = data.type
    this.i = data.i
    this.x = data.x
    this.y = data.y
    this.w = data.w
    this.h = data.h
  }
  get(): IWidget {
    return this
  }
}
