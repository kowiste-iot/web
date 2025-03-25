import type { INotificationService } from '@/features/notification/application/notificationService'
import { Role, type IRole, type IRoleRepository } from '../domain/role'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

export class RoleService {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getRole(id: ID): Promise<IRole | null> {
    try {
      const role = await this.roleRepository.findById(id)
      return role
    } catch (error) {
      const errors = ValidationError.fromRequest<IRole>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch role: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getRoles(): Promise<IRole[]> {
    try {
      const roles = await this.roleRepository.findAll()
      return roles
    } catch (error) {
      const errors = ValidationError.fromRequest<IRole>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch roles: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createRole(data: IRole): Promise<ValidationError<IRole> | null> {
    try {
      const errors = Role.validate(data)

      if (errors.hasErrors()) {
        return errors
      }
      const role = new Role(data)
      await this.roleRepository.create(role)
      this.notificationService.success('Role created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IRole>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create role: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteRole(id: ID): Promise<void> {
    try {
      await this.roleRepository.delete(id)
      this.notificationService.success('Role deleted successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IRole>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete role: ' + errors.getError('gError')!
      )
      return
    }
  }
}
