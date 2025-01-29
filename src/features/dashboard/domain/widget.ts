import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { EWidget } from './EWidget'
import { WidgetValidator } from './widgetValidator'

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
  showLabel: boolean
  showEmotion: boolean
  trueEmotion: boolean
  link: IWidgetLinkData[]
  options: any
}

export interface IWidgetLinkData {
  measure: string
  tag: string
  legend: string
}

export class Widget implements IWidget {
  private static validator = new WidgetValidator()

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

  constructor(props?: IWidget) {
    if (!props) return
    this.id = props.id
    this.dashboardID = props.dashboardID
    this.type = props.type
    this.i = props.i
    this.x = props.x
    this.y = props.y
    this.w = props.w
    this.h = props.h
    this.data = {
      label: props.data.label ?? '',
      showLabel: props.data.showLabel ?? true,
      showEmotion: props.data.showEmotion ?? true,
      trueEmotion: props.data.trueEmotion ?? false,
      link: props.data.link ?? [],
      options: props.data.options ?? {},
    }
  }
  static validate(data: Partial<IWidget>): ValidationError<IWidget> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IWidget>(
    field: K,
    value: IWidget[K]
  ): string {
    return this.validator.validateField(field, value)
  }
  toJSON(): IWidget {
    return {
      id: this.id,
      dashboardID: this.dashboardID,
      type: this.type,
      i: this.i,
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      data: {
        label: this.data.label,
        showLabel: this.data.showLabel,
        showEmotion: this.data.showEmotion,
        trueEmotion: this.data.trueEmotion,
        link: this.data.link,
        options: this.data.options,
      },
    }
  }
}

export interface IWidgetRepository {
  findById(id: string): Promise<IWidget | null>
  findAll(): Promise<IWidget[]>
  create(widget: IWidget): Promise<void>
  update(widget: IWidget): Promise<void>
  delete(id: string): Promise<void>
}
