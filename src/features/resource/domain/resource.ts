// features/resource/domain/resource.ts
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { ResourceValidator } from './resourceValidator'

export interface IResource {
  id?: string
  name: string
  type?: string
  uris?: string[]
  scopes?: string[]
  attributes?: Record<string, string[]>
  displayName?: string
  iconUri?: string
}

export class Resource implements IResource {
  private static validator = new ResourceValidator()
  id?: string
  name: string
  type?: string
  uris?: string[]
  scopes?: string[]
  attributes?: Record<string, string[]>
  displayName?: string
  iconUri?: string

  constructor(props: IResource) {
    this.id = props.id
    this.name = props.name
    this.type = props.type
    this.uris = props.uris
    this.scopes = props.scopes
    this.attributes = props.attributes
    this.displayName = props.displayName
    this.iconUri = props.iconUri
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
      type: this.type,
      uris: this.uris,
      scopes: this.scopes,
      attributes: this.attributes,
      displayName: this.displayName,
      iconUri: this.iconUri,
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
