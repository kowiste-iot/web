import { useTenant } from '@/composable/useTenant'
import { useSessionStore } from '@/features/session/store/useSessionStore'

export abstract class BaseRepository {
  protected baseUrl: string

  constructor(resource: string) {
    const { getTenantId } = useTenant()
    const sessionStore = useSessionStore()
    const branch = sessionStore.getCurrentBranch

    this.baseUrl = `${getTenantId()}/${branch}/${resource}`
  }
}
