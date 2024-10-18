export interface IDashboard {
  id: string
  name: string
  parent: string
}

export class Dashboard implements IDashboard {
  id: string = ''
  name: string = ''
  parent: string = ''
  constructor(data?: IDashboard) {
    if (data) {
      this.id=data.id
      this.name = data.name
      this.parent = data.name
    }
  }
  get(): IDashboard {
    return this
  }
}
