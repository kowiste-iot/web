export interface IAlert {
  id?: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date
}

export class Alert implements IAlert {
  id?: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date

  constructor(props: IAlert) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }

  toJSON(): IAlert {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}

export interface IAlertRepository {
  findById(id: string): Promise<IAlert | null>
  findAll(): Promise<IAlert[]>
  create(alert: IAlert): Promise<void>
  update(alert: IAlert): Promise<void>
  delete(id: string): Promise<void>
}
