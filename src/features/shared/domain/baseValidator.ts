import { z } from 'zod'
export interface IValidationError<T> {
  hasErrors(): boolean
  getError(field: keyof T): string | undefined
  getErrors(): { [K in keyof T]?: string }
}
export interface IError {
  gError?: string
}
export class ValidationMapper {
  // Generic method that works with any entity type
  static validateField<T extends object, K extends keyof T>(
    validator: { validateFieldMessage(field: K, value: T[K]): string },
    field: K,
    value: T[K],
    currentErrors: ValidationError<T> | null = null
  ): ValidationError<T> {
    // Get the validation message
    const errorMessage = validator.validateFieldMessage(field, value)

    // Clone existing errors or create new error object
    const errorObj: { [key in keyof T]?: string } = currentErrors
      ? currentErrors.getErrors()
      : {}

    // Update the error for this field
    if (errorMessage) {
      errorObj[field] = errorMessage
    } else {
      delete errorObj[field]
    }

    // Return a new ValidationError instance
    return new ValidationError<T>(errorObj)
  }
}

export class ValidationError<T> implements IValidationError<T> {
  private errors: { [K in keyof T]?: string } = {}

  constructor(errors: { [K in keyof T]?: string } = {}) {
    this.errors = { ...errors }
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0
  }

  getError(field: keyof T): string | undefined {
    return this.errors[field]
  }

  getErrors(): { [K in keyof T]?: string } {
    return { ...this.errors }
  }

  static fromRequest<T>(error: unknown): ValidationError<T> {
    const errors: { [key: string]: string } = {}

    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      error.errors.forEach((err) => {
        const field = err.path[0] as keyof T
        errors[field as string] = err.message
      })
    } else {
      // For Axios errors and other errors, create a new ValidationError with a type assertion
      errors['gError'] =
        error instanceof Error
          ? error.message
          : 'An unknown error occurred in the request'
    }
    return new ValidationError<T>(errors as { [K in keyof T]?: string })
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

  // Returns only the error message for a field
  validateFieldMessage<K extends keyof T>(field: K, value: T[K]): string {
    try {
      const fieldSchema = this.schema.shape[field as string]
      if (!fieldSchema) {
        return 'Field not found in schema'
      }
      fieldSchema.parse(value)
      return ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Invalid value'
      }
      return 'Invalid value'
    }
  }
}
