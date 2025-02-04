// features/device/domain/device.ts
import { DeviceValidator } from './deviceValidator'
import type { ValidationError } from '@/features/shared/domain/baseValidator'

export interface IDevice {
  id: string
  name: string
  parent: string
  description?: string
  updatedAt?: Date
}

export class Device implements IDevice {
  private static validator = new DeviceValidator()
  id: string
  name: string
  parent: string
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
    value: IDevice[K]
  ): string {
    return this.validator.validateField(field, value)
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
  findById(id: string): Promise<IDevice | null>
  findAll(): Promise<IDevice[]>
  create(device: IDevice): Promise<void>
  update(device: IDevice): Promise<void>
  delete(id: string): Promise<void>
}
