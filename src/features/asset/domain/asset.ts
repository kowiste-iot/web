import {
  ValidationMapper,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import { AssetValidator } from './assetValidator'
import type { IHasParent } from '@/features/shared/domain/hasParent'
import type { ID } from '@/features/shared/domain/id'

export interface IAsset extends IHasParent {
  id: ID
  name: string
  parent?: string
  description?: string
  updatedAt?: Date
}

export class Asset implements IAsset {
  private static validator = new AssetValidator()
  id: ID
  name: string
  parent?: ID
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
    value: IAsset[K],
    currentErrors: ValidationError<IAsset> | null = null
  ): ValidationError<IAsset> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
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
  findById(id: ID): Promise<IAsset | null>
  findAll(): Promise<IAsset[]>
  create(asset: IAsset): Promise<void>
  update(asset: IAsset): Promise<void>
  delete(id: ID): Promise<void>
}
