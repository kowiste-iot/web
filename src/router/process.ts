
const processRoutes = [
  {
    path: '/process',
    name: 'process',
    component: () => import('@/views/process/Process.vue'),
  },
  {
    path: '/process/alert',
    name: 'alert',
    component: () => import('@/views/process/Alert.vue'),
  },
  {
    path: '/process/action',
    name: 'action',
    component: () => import('@/views/process/Action.vue'),
  },
]

export default processRoutes
