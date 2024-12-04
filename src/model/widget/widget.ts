import { EWidget } from '@/enums/dashboard/EWidget'

export interface IWidget {
  id: string
  dashboardID: string
  type: EWidget
  i: number
  x: number
  y: number
  w: number
  h: number
  data: IWidgetData
}
export interface IWidgetData {
  label: string
  showLabel: boolean //show label
  showEmotion: boolean //show emotion card
  trueEmotion: boolean //negative emotion calculation
  link: IWidgetLinkData[] //data link to this widget
  options: any
}
export interface IWidgetLinkData {
  measure: string
  tag: string
  legend: string
}
export class Widget implements IWidget {
  id: string = ''
  dashboardID: string = ''
  type: EWidget = EWidget.Boolean
  i: number = 0
  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0
  data: IWidgetData = {
    label: '',
    showLabel: true,
    showEmotion: true,
    trueEmotion: false,
    link: [],
    options: {},
  }
  constructor(data?: IWidget) {
    if (!data) return
    this.id = data.id
    this.dashboardID = data.dashboardID
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
