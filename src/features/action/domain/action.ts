export interface IAction {
  id?: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date
}

export class Action implements IAction {
  id?: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date

  constructor(props: IAction) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }

  toJSON(): IAction {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}

export interface IActionRepository {
  findById(id: string): Promise<IAction | null>
  findAll(): Promise<IAction[]>
  create(action: IAction): Promise<void>
  update(action: IAction): Promise<void>
  delete(id: string): Promise<void>
}
