export interface IElement {}

export class Element implements IElement {
  constructor(data: IElement) {}
  get(): IElement {
    return this
  }
}
