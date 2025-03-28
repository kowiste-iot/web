import type { INotificationService } from '@/features/notification/application/notificationService'
import { type IScope, type IScopeRepository } from '../domain/scope'
import { ValidationError } from '@/features/shared/domain/baseValidator'

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
      const errors = ValidationError.fromRequest<IScope>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch scopes: ' + errors.getError('gError')!
      )
      return []
    }
  }
}
