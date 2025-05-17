import type { IScope } from '@/features/scope/domain/scope'

export interface ResourceDTO {
  id: string
  name: string
  displayName: string
  roles: Record<string, IScope[]>
}
