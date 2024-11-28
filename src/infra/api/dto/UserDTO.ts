export interface UserDTO {
  id: number
  full_name: string // Different from domain model (snake_case)
  email: string
  created_at: string // ISO date string from API
  is_active: boolean // Additional API field
  role: string // Additional API field
}
