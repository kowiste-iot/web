import { useTenant } from '@/composable/useTenant'
import { useUserStore } from '@/features/user/stores/useUserStore'

export abstract class BaseRepository {
  protected baseUrl: string

  constructor(resource: string) {
    const { getTenantId } = useTenant()
    const userStore = useUserStore()
    const branch = userStore.getCurrentBranch

    this.baseUrl = `${getTenantId()}/${branch}/${resource}`
  }
}
