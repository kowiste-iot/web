export interface IElement {
 
}

export class Element {
    data: IElement
    constructor(data: IElement) {
        this.data = data
    }
    get():IElement{
        return this.data
    }

}