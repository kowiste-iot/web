// src/features/scope/infrastructure/piniaScopeProvider.ts
import type { IScope } from '../domain/scope'
import type { IScopeProvider } from '../dtos/scopeProvider'
import { useScopeStore } from '../stores/useScopeStore'

export class PiniaScopeProvider implements IScopeProvider {
  getScopesMap(): Record<string, IScope> {
    const scopesStore = useScopeStore()
    return scopesStore.scopesMap
  }
}
