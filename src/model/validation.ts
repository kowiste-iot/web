import { type ZodTypeAny, z } from 'zod'
// import { groupBy } from 'lodash'
import { ref, toValue } from 'vue'
export default class Validation<T extends ZodTypeAny> {
  private schema: T
  private data: Record<string, unknown>
  private isValid = ref(true)
  private errors: Record<string, z.ZodIssue[]> | null = null

  constructor(schema: T, data: Record<string, unknown>) {
    this.schema = schema
    this.data = data
  }
  private clearErrors() {
    this.errors = null
  }
  public validate(): Record<string, z.ZodIssue[]> | null {
    this.clearErrors()
    const result = this.schema.safeParse(toValue(this.data))
    this.isValid.value = result.success
    if (!result.success) {
    //   this.errors = groupBy(result.error.issues, 'path')
    }
    return this.errors
  }
  public getErrors() {
    return this.errors
  }
  public clear() {
    this.clearErrors()
  }
}
