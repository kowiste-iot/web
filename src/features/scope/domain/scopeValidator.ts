// features/resource/domain/resourceValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IScope } from './scope'

const scopeSchema = z.object({
  name: z
    .string({
      required_error: 'name is required',
      invalid_type_error: 'name must be a string',
    })
    .min(EValidation.NameMin, {
      message: 'name too short',
    })
    .max(EValidation.NameMax, {
      message: 'name too long',
    }),
  displayName: z.string().optional(),

})

export type ScopeSchema = z.infer<typeof scopeSchema>

export class ScopeValidator extends BaseValidator<
  IScope,
  typeof scopeSchema
> {
  protected schema = scopeSchema
}
