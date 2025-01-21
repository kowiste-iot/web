// features/resource/domain/resource.ts
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { ResourceValidator } from './resourceValidator'

export interface IResource {
  id: string
  name: string
  displayName: string
  roles: { [key: string]: string[] }
}

export class Resource implements IResource {
  private static validator = new ResourceValidator()
  id: string
  name: string
  displayName: string
  roles: { [key: string]: string[] }

  constructor(props: IResource) {
    this.id = props.id
    this.name = props.name
    this.displayName = props.displayName
    this.roles = props.roles
  }

  static validate(data: Partial<IResource>): ValidationError<IResource> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IResource>(
    field: K,
    value: IResource[K]
  ): string {
    return this.validator.validateField(field, value)
  }

  toJSON(): IResource {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      roles:this.roles
    }
  }
}

export interface IResourceRepository {
  findById(id: string): Promise<IResource | null>
  findAll(): Promise<IResource[]>
  create(resource: IResource): Promise<void>
  update(resource: IResource): Promise<void>
  delete(id: string): Promise<void>
}
