import { z } from 'zod'
import Validation from '@/model/validation'
import { EValidation } from '@/enums/EValidation'
import type { IAsset } from '@/model/asset/asset'
import type { IWidget } from '../widget'

export class FormWidget implements IWidget {
  id: string = ''
  name: string = ''
  dashboardID: string = ''
  description: string = ''
  type: number = 0
  i: number = 0
  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0

  error: Record<string, z.ZodIssue[]> | null
  constructor(data?: IWidget) {
    this.error = null
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
