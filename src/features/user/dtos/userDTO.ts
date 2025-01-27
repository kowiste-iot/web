export interface UserDTO {
  id: string
  firstName: string
  lastName: string
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
