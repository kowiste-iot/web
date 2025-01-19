// features/role/application/roleService.ts
import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { Role, type IRole, type IRoleRepository } from '../domain/role'

export class RoleService {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getRole(id: string): Promise<IRole | null> {
    try {
      const role = await this.roleRepository.findById(id)
      return role
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch role: ${error.message}`
          : 'Failed to fetch role'
      this.notificationService.error(msg)
      return null
    }
  }

  async getRoles(): Promise<IRole[]> {
    try {
      const roles = await this.roleRepository.findAll()
      return roles
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch roles: ${error.message}`
          : 'Failed to fetch roles'
      this.notificationService.error(msg)
      return []
    }
  }

  async createRole(data: IRole): Promise<boolean> {
    try {
      const errors = Role.validate(data)

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const role = new Role(data)
      await this.roleRepository.create(role)
      this.notificationService.success('Role created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid role data')
      } else {
        this.notificationService.error('Failed to create role')
      }
      return false
    }
  }
  //Cant update
  // async updateRole(data: IRole): Promise<boolean> {
  //   try {
  //     const errors = Role.validate(data)
  //     if (Object.keys(errors).length > 0) {
  //       const errorMessages = Object.values(errors).filter(Boolean)
  //       this.notificationService.error(errorMessages.join(', '))
  //       return false
  //     }
  //     const existingRole = useRoleStore().getRoleById(data.id)
  //     if (!existingRole) throw new Error('Role not found')

  //     const updatedRole = new Role({ ...existingRole, ...data })

  //     await this.roleRepository.update(updatedRole)
  //     this.notificationService.success('Role updated successfully')
  //     return true
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       this.notificationService.error('Invalid role data')
  //     } else {
  //       this.notificationService.error('Failed to update role')
  //     }
  //     return false
  //   }
  // }

  async deleteRole(id: string): Promise<void> {
    try {
      await this.roleRepository.delete(id)
      this.notificationService.success('Role deleted successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete role: ${error.message}`
          : 'Failed to delete role'
      this.notificationService.error(msg)
    }
  }
}
