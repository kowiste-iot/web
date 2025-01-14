// features/shared/domain/baseValidator.ts
import { z } from 'zod'

export type ValidationError<T> = {
  [K in keyof T]?: string
}

export abstract class BaseValidator<
  T extends object,
  Schema extends z.ZodObject<z.ZodRawShape>
> {
  protected abstract schema: Schema

  validate(data: Partial<T>): ValidationError<T> {
    const errors: ValidationError<T> = {}

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

    return errors
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
