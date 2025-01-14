import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { AssetValidator } from './assetValidator'

export interface IAsset {
  id: string
  name: string
  parent?: string
  description?: string
  updatedAt?: Date
}

export class Asset implements IAsset {
  private static validator = new AssetValidator()
  id: string
  name: string
  parent?: string
  description?: string
  updatedAt?: Date

  constructor(props: IAsset) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }
  static validate(data: Partial<IAsset>): ValidationError<IAsset> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IAsset>(
    field: K,
    value: IAsset[K]
  ): string {
    return this.validator.validateField(field, value)
  }

  toJSON(): IAsset {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}
export interface IAssetRepository {
  findById(id: string): Promise<IAsset | null>
  findAll(): Promise<IAsset[]>
  create(asset: IAsset): Promise<void>
  update(asset: IAsset): Promise<void>
  delete(id: string): Promise<void>
}
