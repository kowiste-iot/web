export interface IMeasure {
  id: string
  name: string
  parent: string
  description?: string
}

export class Measure implements IMeasure {
  id: string = ''
  name: string = ''
  parent: string = ''
  description?: string | undefined;
  constructor(data?: IMeasure) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.parent = data.name
    }
  }
  get(): IMeasure {
    return this
  }
}
