import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { MeasureValidator } from './measureValidator'
import type { IAsset } from '@/features/asset/domain/asset'
import type { IHasParent } from '@/features/shared/domain/hasParent'

export interface IMeasure extends IHasParent{
  id: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date
}

export class Measure implements IMeasure {
  private static validator = new MeasureValidator()
  id: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date

  constructor(props: IMeasure) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IMeasure>): ValidationError<IMeasure> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IMeasure>(
    field: K,
    value: IMeasure[K]
  ): string {
    return this.validator.validateField(field, value)
  }
  toJSON(): IMeasure {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}
export interface IMeasureRepository {
  findById(id: string, assets: IAsset[]): Promise<IMeasure | null>
  findAll(assets: IAsset[]): Promise<IMeasure[]>
  create(asset: IMeasure): Promise<void>
  update(asset: IMeasure): Promise<void>
  delete(id: string): Promise<void>
}
