export interface ResourceDTO {
  id: string
  name: string
  displayName: string
  roles: Record<string, string[]>
}
