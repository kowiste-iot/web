export class Tab {
  id: number
  name: string
  selected: boolean
  icon?: string
  opt: Record<string, string>

  constructor(id: number = 0, name: string = '', selected: boolean = false) {
    this.id = id
    this.name = name
    this.selected = selected
    this.opt = {}
  }

  setIcon(icon: string): Tab {
    this.icon = icon
    return this
  }
  setOpt(key: string, value: string): Tab {
    this.opt[key] = value

    return this
  }
  getOpt(key: string): string {
    return this.opt[key]
  }
}
