// src/router/assetRoutes.js
import Dashboard from '@/views/dashboard/Dashboard.vue'
import Dashboards from '@/views/dashboard/Dashboards.vue'

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'dashboards',
    component: Dashboards,
  },
  {
    path: '/dashboard/:id',
    name: 'dashboard',
    component: Dashboard,
  },
]

export default dashboardRoutes
