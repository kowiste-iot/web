import { z } from 'zod'
import { EValidation } from '@/enums/EValidation'
import type { IMeasure } from '../measure'
import type { IAsset } from '@/model/asset/asset'
import { FormBase } from '@/model/base/formBase'

export interface IFormMeasure {
  id: string
  name: string
  parent: string
  parentSelected?: IMeasure
}

export class FormMeasure
  extends FormBase<typeof measureSchema>
  implements IFormMeasure
{
  id: string = ''
  name: string = ''
  parent: string = ''
  parentSelected?: IMeasure
  constructor(data?: IMeasure) {
    super(measureSchema)
    if (!data) return
    this.id = data.id
    this.name = data.name
    this.parent = data.parent
  }
  loadAsset(data: IAsset[]) {
    if (!data) return
    this.parentSelected = data.find((asset) => asset.id == this.parent)
  }
  change() {
    if (!this.parentSelected) return
    this.parent = this.parentSelected.id
    this.validate()
  }
}
const measureSchema = z.object({
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
