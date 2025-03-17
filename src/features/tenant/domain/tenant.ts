import type { ID } from "@/features/shared/domain/id"

export interface ITenant {
  id: ID
  name: string
  lastAccessed: Date
}
