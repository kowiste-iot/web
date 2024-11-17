import { z } from 'zod'
import { type IAsset } from '../asset'
import { EValidation } from '@/enums/EValidation'
import { FormBase } from '@/model/base/formBase'

export interface IFormAsset {
  id: string
  name: string
  parent: string
  parentSelected?: IAsset
}

export class FormAsset
  extends FormBase<typeof assetSchema>
  implements IFormAsset
{
  id: string = ''
  name: string = ''
  parent: string = ''
  parentSelected?: IAsset
  constructor(data?: IAsset) {
    super(assetSchema)
    if (!data) return
    this.id = data.id
    this.name = data.name
    this.parent = data.parent
  }
  load(data: IAsset[]) {
    if (!data) return
    this.parentSelected = data.find((asset) => asset.id == this.parent)
  }

  change() {
    if (!this.parentSelected) return
    this.parent = this.parentSelected.id
    this.validate()
  }
}
const assetSchema = z.object({
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
