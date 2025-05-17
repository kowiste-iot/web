import { z } from 'zod'

export class FormAdherence {
  data: boolean
  error: Record<string, z.ZodIssue[]> | null
  constructor() {
    this.data = false

    this.error = null
  }
  load(data: any) {
    if (!data) return
  }

  get():boolean {
    return this.data
  }


  getError(field: string): string | undefined {
    if (!this.error) return undefined
    const errorField = this.error![field] as z.ZodIssue[]
    return errorField ? errorField[0]?.message : undefined
  }
  errors(): boolean {
    return this.error ? true : false
  }
}