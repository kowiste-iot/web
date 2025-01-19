// features/resource/dtos/resourceDTO.ts
export interface ResourceDTO {
  id?: string
  name: string
  type?: string
  uris?: string[]
  scopes?: string[]
  attributes?: Record<string, string[]>
  display_name?: string
  icon_uri?: string
}

// features/resource/dtos/resourceMapper.ts

