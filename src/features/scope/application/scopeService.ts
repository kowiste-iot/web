import type { INotificationService } from '@/features/notification/application/notificationService'
import { type IScope, type IScopeRepository } from '../domain/scope'

export class ScopeService {
  constructor(
    private readonly scopeRepository: IScopeRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getScopes(): Promise<IScope[]> {
    try {
      const scopes = await this.scopeRepository.findAll()
      return scopes
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch scopes: ${error.message}`
          : 'Failed to fetch scopes'
      this.notificationService.error(msg)
      return []
    }
  }
}
