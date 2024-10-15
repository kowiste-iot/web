import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import Settings from '@/views/Settings.vue'
import ErrorPage from '@/views/Error.vue'
import { useRequest } from '@/plugins/request/store'
import assetRoutes from './asset'
import dashboardRoutes from './dashboard'
import measureRoutes from './measure'
import deviceRoutes from './device'
import adminRoutes from './admin'
import processRoutes from './process'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    ...dashboardRoutes,
    ...assetRoutes,
    ...measureRoutes,
    ...deviceRoutes,
    ...adminRoutes,
    ...processRoutes,
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/:catchAll(.*)*',
      redirect: '/error',
    },
  ],
})
router.beforeEach((from, to) => {
  useRequest().cancelAll()
})
export default router
