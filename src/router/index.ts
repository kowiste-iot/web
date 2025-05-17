import { createRouter, createWebHistory, type Router } from 'vue-router'
import { useRequest } from '@/plugins/request/store'
import assetRoutes from './asset'
import dashboardRoutes from './dashboard'
import adminRoutes from './admin'
import processRoutes from './process'
import { tenantGuard } from '@/features/tenant/router/router'
import { authGuard } from '@/plugins/security/router'
import logger from '@/utils/log/logger'

let router: Router | null = null

const createAppRouter = (baseUrl: string) => {
  logger.debug('Init router')
  router = createRouter({
    history: createWebHistory(baseUrl),
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/tenant',
        name: 'tenant',
        component: () => import('@/views/TenantSelection.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/onboard',
        name: 'onboard',
        component: () => import('@/views/onboarding/Onboarding.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/Settings.vue'),
      },
      {
        path: '/error',
        name: 'error', // Changed to lowercase to match the guards
        component: () => import('@/views/Error.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: () => import('@/views/Error.vue'), // Make sure this component exists
        meta: { requiresAuth: false },
      },

      ...dashboardRoutes,
      ...assetRoutes,
      ...adminRoutes,
      ...processRoutes,

      {
        path: '/:pathMatch(.*)*',
        redirect: '/error',
      },
    ],
  })

  // Cancel pending requests
  router.beforeEach((to, from) => {
    useRequest().cancelAll()
    const nextURL = to.fullPath.split('#')[0]
    if (to.fullPath !== nextURL) {
      to.fullPath = nextURL
      return to.fullPath
    }
  })

  // Apply tenant guard first
  //router.beforeEach(tenantGuard)

  // Then apply auth guard
  router.beforeEach(authGuard)

  return router
}

export function getRouter(): Router {
  if (!router) {
    throw new Error('Router not initialized. Call createAppRouter first')
  }
  return router
}

// Export a function instead of the router directly
export default createAppRouter
