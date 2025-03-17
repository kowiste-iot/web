import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import {
  Resource,
  type IResource,
  type IResourceRepository,
} from '../domain/resource'
import type { ID } from '@/features/shared/domain/id'

export class ResourceService {
  constructor(
    private readonly resourceRepository: IResourceRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getResource(id: ID): Promise<IResource | null> {
    try {
      const resource = await this.resourceRepository.findById(id)
      return resource
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch resource: ${error.message}`
          : 'Failed to fetch resource'
      this.notificationService.error(msg)
      return null
    }
  }

  async getResources(): Promise<IResource[]> {
    try {
      const resources = await this.resourceRepository.findAll()
      return resources
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch resources: ${error.message}`
          : 'Failed to fetch resources'
      this.notificationService.error(msg)
      return []
    }
  }

  async createResource(data: IResource): Promise<boolean> {
    try {
      const errors = Resource.validate(data)

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const resource = new Resource(data)
      await this.resourceRepository.create(resource)
      this.notificationService.success('Resource created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid resource data')
      } else {
        this.notificationService.error('Failed to create resource')
      }
      return false
    }
  }

  async updateResource(data: IResource): Promise<boolean> {
    try {
      const errors = Resource.validate(data)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      await this.resourceRepository.update(data)
      this.notificationService.success('Resource updated successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid resource data')
      } else {
        this.notificationService.error('Failed to update resource')
      }
      return false
    }
  }

  async deleteResource(id: ID): Promise<void> {
    try {
      await this.resourceRepository.delete(id)
      this.notificationService.success('Resource deleted successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete resource: ${error.message}`
          : 'Failed to delete resource'
      this.notificationService.error(msg)
    }
  }
}
