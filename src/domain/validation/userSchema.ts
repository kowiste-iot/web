import { z } from 'zod'

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  isActive: z.boolean(),
  role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.GUEST]),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserParams = z.infer<typeof createUserSchema>
export type UpdateUserParams = z.infer<typeof updateUserSchema>
