// features/device/domain/deviceValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IMeasure } from './measure'

const measureSchema = z.object({
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
  parent: z.string().uuid({
    message: 'select a valid parent',
  }),
  description: z.string().max(EValidation.NameMax, {
    message: 'description too long',
  }),
})

export type MeasureSchema = z.infer<typeof measureSchema>

export class MeasureValidator extends BaseValidator<IMeasure, typeof measureSchema> {
  protected schema = measureSchema
}
