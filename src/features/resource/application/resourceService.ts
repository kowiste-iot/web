import type { INotificationService } from '@/features/notification/application/notificationService'
import {
  Resource,
  type IResource,
  type IResourceRepository,
} from '../domain/resource'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

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
      const errors = ValidationError.fromRequest<IResource>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch resource: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getResources(): Promise<IResource[]> {
    try {
      const resources = await this.resourceRepository.findAll()
      return resources
    } catch (error) {
      const errors = ValidationError.fromRequest<IResource>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch resource: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createResource(
    data: IResource
  ): Promise<ValidationError<IResource> | null> {
    try {
      const errors = Resource.validate(data)

      if (Object.keys(errors).length > 0) {
        return errors
      }
      const resource = new Resource(data)
      await this.resourceRepository.create(resource)
      this.notificationService.success('Resource created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IResource>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create resource: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateResource(
    data: IResource
  ): Promise<ValidationError<IResource> | null> {
    try {
      const errors = Resource.validate(data)
      if (Object.keys(errors).length > 0) {
        return errors
      }

      await this.resourceRepository.update(data)
      this.notificationService.success('Resource updated successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IResource>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update resource: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteResource(id: ID): Promise<void> {
    try {
      await this.resourceRepository.delete(id)
      this.notificationService.success('Resource deleted successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IResource>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete resource: ' + errors.getError('gError')!
      )
      return
    }
  }
}
