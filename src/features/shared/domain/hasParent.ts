import type { IError } from "./baseValidator"
import type { ID } from "./id"

export interface IHasParent extends IError {
  id: ID 
  parent?: ID
  name: string
}
export type WithParentName<T extends IHasParent> = T & {
  parentName: string
}
