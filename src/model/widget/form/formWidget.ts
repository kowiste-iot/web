import { z } from 'zod'
import { EValidation } from '@/enums/EValidation'
import { type IWidgetLinkData, type IWidget, type IWidgetData } from '../widget'
import type { IWidgetType } from '../widgetType'
import { FormBase } from '@/model/base/formBase'
import { EWidget } from '@/enums/dashboard/EWidget'

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
  type: EWidget = EWidget.None
  i: number = 0
  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0
  data: IWidgetData = {
    label: '',
    showLabel: false,
    showEmotion: false,
    trueEmotion: false,
    link: new Array<IWidgetLinkData>(),
    options: {},
  }

  constructor() {
    super(widgetSchema)

    this.id = ''
    this.dashboardID = ''
    this.type = 0
    this.i = 0
    this.x = 0
    this.y = 0
    this.w = 5
    this.h = 4
    this.data = {
      link: new Array<IWidgetLinkData>(),
      options: {},
    } as IWidgetData
    const t = new Array<string>()
    t.push('')
    this.data.link.push({
      tags: t,
    } as IWidgetLinkData)
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
