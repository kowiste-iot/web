export interface IMenu{
    label: string
    icon: string
    isParent:boolean
    subMenu: IMenu[]
}