import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useRequest } from '@/plugins/request/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
   
  ]
})
router.beforeEach((from,to)=>{
useRequest().cancelAll()
})
export default router
