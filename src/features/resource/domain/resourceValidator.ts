import { z } from 'zod'
import { BaseValidator } from '@/features/shared/domain/baseValidator'
import { EValidation } from '@/features/shared/enum/EValidation'
import type { IResource } from './resource'

const resourceSchema = z.object({
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
  type: z.string().optional(),
  uris: z.array(z.string()).optional(),
  scopes: z.array(z.string()).optional(),
  attributes: z.record(z.array(z.string())).optional(),
  displayName: z.string().optional(),
  iconUri: z.string().optional(),
})

export type ResourceSchema = z.infer<typeof resourceSchema>

export class ResourceValidator extends BaseValidator<
  IResource,
  typeof resourceSchema
> {
  protected schema = resourceSchema
}
