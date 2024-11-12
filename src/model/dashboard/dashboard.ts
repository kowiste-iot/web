export interface IDashboard {
  id: string
  name: string
  parent: string
  description?: string
}

export class Dashboard implements IDashboard {
  id: string = ''
  name: string = ''
  parent: string = ''
  description?: string | undefined;
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
