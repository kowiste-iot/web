import { z } from 'zod'
import { EValidation } from '@/enums/EValidation'
import type { IWidget, IWidgetData } from '../widget'
import type { IWidgetType } from '../widgetType'
import { FormBase } from '@/model/base/formBase'
import type { EWidget } from '@/enums/dashboard/EWidget'

export interface IFormWidget {
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

export class FormWidget
  extends FormBase<typeof widgetSchema>
  implements IFormWidget
{
  id: string = ''
  dashboardID: string = ''
  type: number = 0
  i: number = 0
  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0
  data: IWidgetData = {
    label: '',
    showLabel: false,
    showEmotion: false,
    options: {},
  }

  constructor(data?: IWidget) {
    super(widgetSchema)
    if (!data) return
    this.id = data.id
    this.dashboardID = data.dashboardID
    this.type = data.type
    this.i = data.i
    this.x = data.x
    this.y = data.y
    this.w = data.w
    this.h = data.h
    this.data = data.data
  }
  set(data: IWidgetType, dahsboardID: string) {
    this.dashboardID = dahsboardID
    this.type = data.id
  }
  calculate(widgets: IWidget[]) {
    this.i = widgets.length
    this.id = String(this.i)
    this.w = 6
    this.h = 3
    this.x = 12
    this.y = 0
  }
  change() {
    this.validate()
  }
}
const widgetSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(EValidation.NameMin, {
      message: 'Name too short',
    })
    .max(EValidation.NameMax, {
      message: 'Name too long',
    }),
})
