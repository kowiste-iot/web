// domain/userValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import type { IUser } from './user'
import { EValidation } from '@/features/shared/enum/EValidation'

const userSchema = z.object({
  firstName: z
    .string({
      required_error: 'first name is required',
      invalid_type_error: 'first name must be a string',
    })
    .min(EValidation.NameMin, {
      message: 'name too short',
    })
    .max(EValidation.NameMax, {
      message: 'name too long',
    }),
  lastName: z
    .string({
      required_error: 'last name is required',
      invalid_type_error: 'last name must be a string',
    })
    .min(EValidation.NameMin, {
      message: 'name too short',
    })
    .max(EValidation.NameMax, {
      message: 'name too long',
    }),
  email: z.string().email(),
  roles: z.array(z.string()).min(1, { message: 'select at least 1 role' }),
})

export type UserSchema = z.infer<typeof userSchema>

export class UserValidator extends BaseValidator<IUser, typeof userSchema> {
  protected schema = userSchema
}
