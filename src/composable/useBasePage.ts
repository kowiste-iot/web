// composables/useBasePage.ts
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { Path } from '@/features/shared/domain/path'
import { useBreadCrumb } from '@/features/shared/store/breadcrumb'

export function useBasePage(title?: string, path?: Path[]) {
  // Create notification service instance
  const notificationService = new NotificationService(useNotificationStore())

  // Set breadcrumb
  if (title) useBreadCrumb().set(title, path)

  return {
    notificationService,
  }
}
