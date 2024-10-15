// src/router/assetRoutes.js
import Process from '@/views/process/Process.vue'
import Alert from '@/views/process/Alert.vue'
import Action from '@/views/process/Action.vue'

const processRoutes = [
  {
    path: '/process',
    name: 'process',
    component: Process,
  },
  {
    path: '/process/alert',
    name: 'alert',
    component: Alert,
  },
  {
    path: '/process/action',
    name: 'action',
    component: Action,
  },
]

export default processRoutes
