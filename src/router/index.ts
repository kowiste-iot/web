import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ErrorPage from '@/views/Error.vue'
import { useRequest } from '@/plugins/request/store'
import assetRoutes from './asset'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    ...assetRoutes,
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
router.beforeEach((from, to, next) => {
  useRequest().cancelAll()
  next()
})
router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('Navigation failed:', failure)
  }
})
export default router
