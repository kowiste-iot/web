export interface IDevice {
  id: string
  name: string
  parent: string
  description?: string
}

export class Device implements IDevice {
  id: string = ''
  name: string = ''
  parent: string = ''
  description?: string | undefined
  constructor(data?: IDevice) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.parent = data.name
      this.description = data.description
    }
  }
  get(): IDevice {
    return this
  }
}
