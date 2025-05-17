import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IRole } from './role'

const roleSchema = z.object({
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
  description: z
    .string({
      required_error: 'description is required',
      invalid_type_error: 'description must be a string',
    })
    .min(EValidation.NameMin, {
      message: 'name too short',
    })
    .max(EValidation.NameMax, {
      message: 'description too long',
    }),
})

export type RoleSchema = z.infer<typeof roleSchema>

export class RoleValidator extends BaseValidator<IRole, typeof roleSchema> {
  protected schema = roleSchema
}
