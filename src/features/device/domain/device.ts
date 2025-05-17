// features/device/domain/device.ts
import type { IHasParent } from '@/features/shared/domain/hasParent'
import { DeviceValidator } from './deviceValidator'
import {
  ValidationMapper,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import type { ID } from '@/features/shared/domain/id'

export interface IDevice extends IHasParent {
  id: ID
  name: string
  parent: ID
  description?: string
  updatedAt?: Date
}
export interface IDevicePassword {
  id: ID
  clientID: ID
  password: string
}
export function isDevicePassword(obj: any): obj is IDevicePassword {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'password' in obj &&
    typeof obj.password === 'string'
  )
}
export class Device implements IDevice {
  private static validator = new DeviceValidator()
  id: ID
  name: string
  parent: ID
  description?: string
  updatedAt?: Date

  constructor(props: IDevice) {
    this.id = props.id
    this.name = props.name
    this.parent = props.parent
    this.description = props.description
    this.updatedAt = props.updatedAt
  }

  static validate(data: Partial<IDevice>): ValidationError<IDevice> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IDevice>(
    field: K,
    value: IDevice[K],
    currentErrors: ValidationError<IDevice> | null = null
  ): ValidationError<IDevice> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }

  toJSON(): IDevice {
    return {
      id: this.id,
      name: this.name,
      parent: this.parent,
      description: this.description,
    }
  }
}

export interface IDeviceRepository {
  findById(id: ID): Promise<IDevice | null>
  findAll(): Promise<IDevice[]>
  create(device: IDevice): Promise<IDevicePassword>
  update(device: IDevice): Promise<void>
  delete(id: ID): Promise<void>
}
