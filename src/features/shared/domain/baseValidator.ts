// features/shared/domain/baseValidator.ts
import { z } from 'zod'

export class ValidationError<T> {
  constructor(private errors: { [K in keyof T]?: string } = {}) {}

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0
  }
  getError(field: keyof T): string | undefined {
    return this.errors[field]
  }
}

export abstract class BaseValidator<
  T extends object,
  Schema extends z.ZodObject<z.ZodRawShape>
> {
  protected abstract schema: Schema

  validate(data: Partial<T>): ValidationError<T> {
    const errors: { [K in keyof T]?: string } = {}

    try {
      this.schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T
          errors[field] = err.message
        })
      }
    }

    return new ValidationError<T>(errors)
  }

  validateField<K extends keyof T>(field: string, value: T[K]): string {
    try {
      const fieldSchema = this.schema.shape[field]
      if (!fieldSchema) {
        return 'Field not found in schema'
      }
      fieldSchema.parse(value)
      return ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || ''
      }
      return 'Invalid value'
    }
  }
}
