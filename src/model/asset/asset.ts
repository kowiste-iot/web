export interface IAsset {
  id: string
  name: string
  parent: string
}

export class Asset implements IAsset {
  id: string = ''
  name: string = ''
  parent: string = ''
  constructor(data?: IAsset) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.parent = data.name
    }
  }
  get(): IAsset {
    return this
  }
}
