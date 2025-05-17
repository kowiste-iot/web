const adminRoutes = [
  {
    path: '/admin/role',
    name: 'role',
    component: () => import('@/views/admin/Role.vue'),
  },
  {
    path: '/admin/resource',
    name: 'resource',
    component: () => import('@/views/admin/Resource.vue'),
  },
  {
    path: '/admin/user',
    name: 'user',
    component: () => import('@/views/admin/User.vue'),
  },
]

export default adminRoutes
