// features/device/domain/deviceValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IDashboard } from './dashboard'

const dashboardSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
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

export type DashboardSchema = z.infer<typeof dashboardSchema>

export class DashboardValidator extends BaseValidator<IDashboard, typeof dashboardSchema> {
  protected schema = dashboardSchema
}
