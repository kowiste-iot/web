// plugins/security/authGuard.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { keycloakService } from './KeycloakService'
import type { AuthMeta } from '@/features/tenant/router/router'
import { Environment } from '@/utils/enviroment/enviroment'
import logger from '@/utils/log/logger'

// Store last authentication attempt timestamp to prevent loops
let lastAuthAttempt = 0
let authAttemptCount = 0
const MAX_AUTH_ATTEMPTS = 3
const AUTH_ATTEMPT_WINDOW = 2000 // 2 seconds

// Track if the guard is processing an auth request
let authInProgress = false

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const meta = to.meta as AuthMeta
  const publicRoutes = ['tenant', 'error', 'unauthorized']

  // Always allow public routes
  if (publicRoutes.includes(to.name as string)) {
    next()
    return
  }

  // For routes that require auth
  if (meta.requiresAuth !== false) {
    // Prevent authentication loops
    if (authInProgress) {
      logger.debug('Authentication already in progress, allowing navigation')
      next()
      return
    }

    const now = Date.now()
    if (now - lastAuthAttempt < AUTH_ATTEMPT_WINDOW) {
      authAttemptCount++

      if (authAttemptCount > MAX_AUTH_ATTEMPTS) {
        logger.error('Auth guard loop detected, redirecting to error page')
        next({ name: 'error', query: { reason: 'auth_loop' } })
        return
      }
    } else {
      // Reset counter if more than window time has passed
      authAttemptCount = 1
    }

    lastAuthAttempt = now

    // Check if user is authenticated
    if (!keycloakService.isAuthenticated.value) {
      logger.warn('User not authenticated, redirecting to login', to.fullPath)

      // If Keycloak is not yet initialized, just allow navigation
      if (!keycloakService.isInitialized) {
        logger.warn('Keycloak not initialized yet, allowing navigation')
        next()
        return
      }

      // Prevent multiple simultaneous login attempts
      authInProgress = true

      // Try to login
      const env = Environment.getInstance()
      keycloakService
        .login(`${env.redirectURL}${to.fullPath}`)
        .then(() => {
          // This might not be reached due to redirect
          authInProgress = false
          next()
        })
        .catch(() => {
          authInProgress = false
          next({ name: 'error', query: { reason: 'auth_failed' } })
        })
      return
    }

    // TODO: bring permission Check roles if specified
    // if (meta.roles && !keycloakService.hasAnyRole.value(meta.roles)) {
    //   next({ name: 'unauthorized' })
    //   return
    // }

    // Check resource permissions if specified
    // if (meta.resource && meta.permissions) {
    //   const hasPermission = meta.permissions.every((permission) =>
    //     keycloakService.hasResourcePermission.value(meta.resource!, permission)
    //   )

    //   if (!hasPermission) {
    //     next({ name: 'unauthorized' })
    //     return
    //   }
    // }
  }

  // Allow navigation if all checks passed
  next()
}
