// domain/userValidator.ts
import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import type { IUser } from './user'

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  roles: z.array(z.string()),
  branches: z.array(z.string()),
  preferences: z.object({
    theme: z.string().optional(),
    language: z.string().optional(),
    notifications: z
      .object({
        email: z.boolean(),
        push: z.boolean(),
      })
      .optional(),
  }),
  settings: z.object({
    defaultView: z.string().optional(),
    timezone: z.string().optional(),
  }),
})

export type UserSchema = z.infer<typeof userSchema>

export class UserValidator extends BaseValidator<IUser, typeof userSchema> {
  protected schema = userSchema
}
