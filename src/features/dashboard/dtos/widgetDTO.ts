import type { EWidget } from "../domain/EWidget"

export interface WidgetDTO {
  id: string
  dashboard_id: string
  type: EWidget
  i: number
  x: number
  y: number
  w: number
  h: number
  data: {
    label: string
    show_label: boolean
    show_emotion: boolean
    true_emotion: boolean
    link: {
      measure: string
      tag: string
      legend: string
    }[]
    options: any
  }
}
