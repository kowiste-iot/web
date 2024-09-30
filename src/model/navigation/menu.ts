export interface IMenu {
  label: string
  icon: string
  path: string
  isParent: boolean
  subMenu: IMenu[]
}
