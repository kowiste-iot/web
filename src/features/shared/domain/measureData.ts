import type { ID } from './id'

export interface IMeasureData {
  id: ID
  tenant: string
  branch: string
  time: Date
  data: any
}

export class MeasureData implements IMeasureData {
  id: ID
  tenant: string
  branch: string
  time: Date
  data: any

  constructor(props?: IMeasureData) {
    this.id = props?.id ?? ''
    this.tenant = props?.tenant ?? ''
    this.branch = props?.branch ?? ''
    this.time = props?.time ?? new Date()
    this.data = props?.data ?? {}
  }

  toJSON(): IMeasureData {
    return {
      id: this.id,
      tenant: this.tenant,
      branch: this.branch,
      time: this.time,
      data: this.data,
    }
  }
}
