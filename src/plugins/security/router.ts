import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from './store'
import type { AuthMeta } from '@/features/tenant/router/router'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  const meta = to.meta as AuthMeta
  const publicRoutes = ['tenant', 'error', 'unauthorized']

  // Allow public routes without auth
  if (publicRoutes.includes(to.name as string)) {
    next()
    return
  }

  // For all other routes, require auth by default unless explicitly set to false
  if (meta.requiresAuth !== false) {
    if (!authStore.isAuthenticated) {
      authStore
        .login(to.fullPath)
        .then(() => {
          next()
        })
        .catch(() => {
          next({ name: 'error' })
        })
      return
    }

    // Check roles if specified
    if (meta.roles && !authStore.hasAnyRole(meta.roles)) {
      next({ name: 'unauthorized' })
      return
    }

    // Check resource permissions if specified
    if (meta.resource && meta.permissions) {
      const hasPermission = meta.permissions.every((permission) =>
        authStore.hasResourcePermission(meta.resource!, permission)
      )

      if (!hasPermission) {
        next({ name: 'unauthorized' })
        return
      }
    }
  }

  next()
}
