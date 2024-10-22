import { z } from 'zod'
import Validation from '@/model/validation'
import { EValidation } from '@/enums/EValidation'
import type { IWidget, IWidgetData } from '../widget'
import type { IWidgetType } from '../widgetType'

export class FormWidget implements Partial<IWidget> {
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

  error: Record<string, z.ZodIssue[]> | null
  constructor(data?: IWidget) {
    this.error = null
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
  getError(field: string): string | undefined {
    if (!this.error) return undefined
    const errorField = this.error![field] as z.ZodIssue[]
    return errorField ? errorField[0]?.message : undefined
  }
  change() {
    this.validate()
  }
  validate() {
    this.error = new Validation(schema, this.getRecord()).validate()
  }
  getRecord(): Record<string, unknown> {
    return this as Record<string, unknown>
  }
  errors(): boolean {
    return this.error ? true : false
  }
}
const schema = z.object({
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
