import type { ValidationError } from "./baseValidator"

export interface CreateResult<T> {
  error: ValidationError<T> | null
  data: any | null
}