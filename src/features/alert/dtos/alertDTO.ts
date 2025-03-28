export interface AlertDTO {
  id: string
  name: string
  parent: string
  measures: string[]
  enabled: boolean
  description?: string
  updated_at?: string
}
