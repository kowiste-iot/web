import {
  ValidationMapper,
  type IError,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import { ResourceValidator } from './resourceValidator'
import type { IScope } from '@/features/scope/domain/scope'
import type { ID } from '@/features/shared/domain/id'

export interface IResource extends IError {
  id: ID
  name: string
  displayName: string
  roles: Record<string, IScope[]>
}

export class Resource implements IResource {
  private static validator = new ResourceValidator()
  id: ID
  name: string
  displayName: string
  roles: Record<string, IScope[]>

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
    value: IResource[K],
    currentErrors: ValidationError<IResource> | null = null
  ): ValidationError<IResource> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }

  toJSON(): IResource {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      roles: this.roles,
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
