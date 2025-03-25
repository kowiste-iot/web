// features/resource/domain/resource.ts
import {
  ValidationMapper,
  type IError,
  type ValidationError,
} from '@/features/shared/domain/baseValidator'
import { ScopeValidator } from './scopeValidator'
import type { ID } from '@/features/shared/domain/id'

export interface IScope extends IError {
  id: ID
  name: string
  displayName: string
}

export class Scope implements IScope {
  private static validator = new ScopeValidator()
  id: ID
  name: string
  displayName: string

  constructor(props: IScope) {
    this.id = props.id
    this.name = props.name
    this.displayName = props.displayName
  }

  static validate(data: Partial<IScope>): ValidationError<IScope> {
    return this.validator.validate(data)
  }

  static validateField<K extends keyof IScope>(
    field: K,
    value: IScope[K],
    currentErrors: ValidationError<IScope> | null = null
  ): ValidationError<IScope> {
    return ValidationMapper.validateField(
      this.validator,
      field,
      value,
      currentErrors
    )
  }

  toJSON(): IScope {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
    }
  }
}

export interface IScopeRepository {
  // findById(id: string): Promise<IScope | null>
  findAll(): Promise<IScope[]>
  // create(resource: IScope): Promise<void>
  // update(resource: IScope): Promise<void>
  // delete(id: string): Promise<void>
}
