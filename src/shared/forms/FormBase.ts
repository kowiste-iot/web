import { z } from 'zod'

export abstract class FormBase<T extends z.ZodType> {
  protected schema: T
  error: Record<string, z.ZodIssue[]> | null = null

  constructor(schema: T) {
    this.schema = schema
  }

  validate(): boolean {
    const result = this.schema.safeParse(this.getRecord())

    if (!result.success) {
      // Group errors by field
      this.error = result.error.issues.reduce((acc, issue) => {
        const field = issue.path[0] as string
        if (!acc[field]) {
          acc[field] = []
        }
        acc[field].push(issue)
        return acc
      }, {} as Record<string, z.ZodIssue[]>)
      return false
    }

    this.error = null
    return true
  }

  getError(field: string): string | undefined {
    if (!this.error) return undefined
    const errorField = this.error[field]
    return errorField ? errorField[0]?.message : undefined
  }

  getRecord(): Record<string, unknown> {
    const record: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(this)) {
      if (key !== 'schema' && key !== 'error') {
        record[key] = value
      }
    }
    return record
  }

  hasErrors(): boolean {
    return this.error !== null
  }
}
