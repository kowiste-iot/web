

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'dashboards',
    component: () => import('@/views/dashboard/Dashboards.vue'),
  },
  {
    path: '/dashboard/:did',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
  },
]

export default dashboardRoutes
