import { ApiClient } from '@/shared/api/client'
import { UserService } from '@/features/user/domain/UserService'
import { UserRepository } from '@/features/user/infra/UserRepository'
import { DateTimeService } from '@/shared/service/DateTimeService'

export class Container {
  private static instance: Container
  private services: Map<string, any> = new Map()

  private constructor() {
    this.setupServices()
  }

  private setupServices(): void {
    // API Client
    const apiClient = new ApiClient()

    // Repositories
    const userRepository = new UserRepository(apiClient)

    // Services
    const userService = new UserService(userRepository)

    // Initialize DateTimeService with server timezone
    const dateTimeService = new DateTimeService('Europe/Madrid')

    // Register services
    this.services.set('apiClient', apiClient)
    this.services.set('userRepository', userRepository)
    this.services.set('userService', userService)
    this.services.set('dateTimeService', dateTimeService)
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  get<T>(serviceKey: string): T {
    const service = this.services.get(serviceKey)
    if (!service) {
      throw new Error(`Service ${serviceKey} not found in container`)
    }
    return service
  }
}
