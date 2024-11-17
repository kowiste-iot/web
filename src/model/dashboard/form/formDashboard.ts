import { z } from 'zod'
import type { IDashboard } from '../dashboard'
import type { IAsset } from '@/model/asset/asset'
import { EValidation } from '@/enums/EValidation'
import { FormBase } from '@/model/base/formBase'

export interface IFormDashboard {
  id: string
  name: string
  parent: string
  parentSelected?: IAsset
}

export class FormDashboard
  extends FormBase<typeof dashboardSchema>
  implements IFormDashboard
{
  id: string = ''
  name: string = ''
  parent: string = ''
  parentSelected?: IAsset
  constructor(data?: IDashboard) {
    super(dashboardSchema)
    this.error = null
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
const dashboardSchema = z.object({
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
