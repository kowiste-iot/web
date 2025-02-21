export interface IHasParent {
  id: string | number
  parent?: string | number
  name: string
}
export type WithParentName<T extends IHasParent> = T & {
  parentName: string
}
