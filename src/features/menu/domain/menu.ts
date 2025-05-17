// features/menu/domain/menu.ts
export interface IMenu {
  id: string
  label: string
  icon: string
  path: string
  isParent: boolean
  isHeader?: boolean
  subMenu?: IMenu[]
  requiresOrg?: boolean
}

export class Menu implements IMenu {
  id: string
  label: string
  icon: string
  path: string
  isParent: boolean
  subMenu?: IMenu[]
  requiresOrg: boolean

  constructor(props: IMenu) {
    this.id = props.id
    this.label = props.label
    this.icon = props.icon
    this.path = props.path
    this.isParent = props.isParent
    this.subMenu = props.subMenu
    this.requiresOrg = props.requiresOrg ?? true // Default true since most routes need org
  }
}
