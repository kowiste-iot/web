import type { ID } from "./id"

export interface IHasParent {
  id: ID 
  parent?: ID
  name: string
}
export type WithParentName<T extends IHasParent> = T & {
  parentName: string
}
