export interface IDataDTO {
  id: string
  values: Record<string, any>
  ts: string
}

export interface IDataModel {
  id: string
  values: Record<string, any>
  ts: Date
}

export class DataModel implements IDataModel {
  id: string
  values: Record<string, any>
  ts: Date

  constructor(data: IDataDTO | IDataModel) {
    if (!data.id) {
      throw new Error('id is required')
    }

    this.id = data.id
    this.values = data.values

    try {
      if (!data.ts) {
        this.ts = new Date()
      } else if (data.ts instanceof Date) {
        this.ts = data.ts
      } else {
        const parsedDate = new Date(data.ts)
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date')
        }
        this.ts = parsedDate
      }
    } catch (error) {
      this.ts = new Date() // Fallback to current date if parsing fails
    }
  }

  get(): IDataModel {
    return {
      id: this.id,
      values: this.values,
      ts: this.ts,
    }
  }

  getDTO(): IDataDTO {
    return {
      id: this.id,
      values: this.values,
      ts: this.ts.toISOString(),
    }
  }

  static fromDTO(dto: IDataDTO): DataModel {
    return new DataModel(dto)
  }
}
