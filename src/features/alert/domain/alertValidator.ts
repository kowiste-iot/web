// features/device/domain/deviceValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IAlert } from './alert'

const alertSchema = z.object({
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
  parent: z
    .string()
    .uuid({
      message: 'parent not valid uuid',
    })
    .optional(),
  description: z.string().max(EValidation.NameMax, {
    message: 'description too long',
  }).optional(),
})

export type AlertSchema = z.infer<typeof alertSchema>

export class AlertValidator extends BaseValidator<IAlert, typeof alertSchema> {
  protected schema = alertSchema
}
