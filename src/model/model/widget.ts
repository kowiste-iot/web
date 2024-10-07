import type { EIcon } from "@/enums/gui/EIcon"

export interface IWidget {
  id: number
  name: string
  description: string
  icon: EIcon
}

export class Widget {
  data: IWidget
  constructor(data: IWidget) {
    this.data = data
  }
  get(): IWidget {
    return this.data
  }
}
