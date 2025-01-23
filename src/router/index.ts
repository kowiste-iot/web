import { createRouter, createWebHistory } from 'vue-router'
import { useRequest } from '@/plugins/request/store'
import assetRoutes from './asset'
import dashboardRoutes from './dashboard'
import measureRoutes from './measure'
import deviceRoutes from './device'
import adminRoutes from './admin'
import processRoutes from './process'
import { authGuard } from '@/plugins/security/router'
import { tenantGuard } from '@/features/tenant/router/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      name: 'Error',
      component: () => import('@/views/Error.vue'),
      meta: { requiresAuth: false },
    },

    ...dashboardRoutes,
    ...assetRoutes,
    ...measureRoutes,
    ...deviceRoutes,
    ...adminRoutes,
    ...processRoutes,

    {
      path: '/:pathMatch(.*)*',
      redirect: '/error',
    },
  ],
})

router.beforeEach((to, from) => {
  useRequest().cancelAll()
  const nextURL = to.fullPath.split('#')[0]
  if (to.fullPath !== nextURL) {
    to.fullPath = nextURL
    return to.fullPath
  }
})
router.beforeEach(tenantGuard)
router.beforeEach(authGuard)
export default router
