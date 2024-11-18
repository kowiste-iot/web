import { z } from 'zod'
import { EValidation } from '@/enums/EValidation'
import type { IAsset } from '@/model/asset/asset'
import type { IDevice } from '../device'
import { FormBase } from '@/model/base/formBase'
export interface IFormDevice {
  id: string
  name: string
  parent: string
  parentSelected?: IDevice
}

export class FormDevice
  extends FormBase<typeof deviceSchema>
  implements IFormDevice
{
  id: string = ''
  name: string = ''
  parent: string = ''
  parentSelected?: IDevice
  constructor(data?: IDevice) {
    super(deviceSchema)
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
const deviceSchema = z.object({
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
