import { FormBase } from '@/model/base/formBase'
import { z } from 'zod'

export class FormAlert extends FormBase<typeof alertSchema> {
  data: boolean

  constructor() {
    super(alertSchema)
    this.data = false
  }
  load(data: any) {
    if (!data) return
  }

  get(): boolean {
    return this.data
  }
}

const alertSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, { message: 'Name too short' })
    .max(50, { message: 'Name too long' }),
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, { message: 'Last name too short' })
    .max(50, { message: 'Last name too long' }),
})
