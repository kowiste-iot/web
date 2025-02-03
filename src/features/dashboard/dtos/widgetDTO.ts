import type { EWidget } from '../domain/EWidget'

export interface WidgetDTO {
  id: string
  dashboardID: string
  type: EWidget
  i: number
  x: number
  y: number
  w: number
  h: number
  data: {
    label: string
    showLabel: boolean
    showEmotion: boolean
    trueEmotion: boolean
    link: {
      measure: string
      tag: string
      legend: string
    }[]
    options: any
  }
}
