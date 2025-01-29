// features/resource/domain/resource.ts
import type { ValidationError } from '@/features/shared/domain/baseValidator'
import { ScopeValidator } from './scopeValidator'

export interface IScope {
  id: string
  name: string
  displayName: string
}

export class Scope implements IScope {
  private static validator = new ScopeValidator()
  id: string
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
    value: IScope[K]
  ): string {
    return this.validator.validateField(field, value)
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
