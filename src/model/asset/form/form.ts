import { z } from 'zod'
import { Asset, type IAsset } from '../asset'
import Validation from '@/model/validation'
import { EValidation } from '@/enums/EValidation'

export class FormAsset {
  id: string = ''
  name: string = ''
  parent: string = ''
  parentSelected?: IAsset
  error: Record<string, z.ZodIssue[]> | null
  constructor(data?: IAsset) {
    this.error = null
    if (!data) return
    this.id = data.id
    this.name = data.name
    this.parent = data.parent
  }
  load(data: IAsset[]) {
    if (!data) return
    this.parentSelected = data.find((asset) => asset.id == this.parent)
  }

  getError(field: string): string | undefined {
    if (!this.error) return undefined
    const errorField = this.error![field] as z.ZodIssue[]
    return errorField ? errorField[0]?.message : undefined
  }
  change() {
    if (!this.parentSelected) return
    this.parent = this.parentSelected.id
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