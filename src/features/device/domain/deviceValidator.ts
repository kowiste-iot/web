// features/device/domain/deviceValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IDevice } from './device'

const deviceSchema = z.object({
  id: z.string().uuid().optional(),
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
  description: z
    .string()
    .max(EValidation.NameMax, {
      message: 'description too long',
    })
    .optional(),
  updatedAt: z.date().optional(),
})

export type DeviceSchema = z.infer<typeof deviceSchema>

export class DeviceValidator extends BaseValidator<
  IDevice,
  typeof deviceSchema
> {
  protected schema = deviceSchema
}
