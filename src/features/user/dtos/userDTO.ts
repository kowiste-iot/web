export interface UserDTO {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  roles: string[]
  branches: string[]
  preferences: {
    theme?: string
    language?: string
    notifications?: {
      email: boolean
      push: boolean
    }
  }
  settings: {
    default_view?: string
    timezone?: string
  }
}
