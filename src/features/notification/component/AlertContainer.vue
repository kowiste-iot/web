<template>
  <div class="position-absolute start-50 translate-middle-x  mt-3 col-md-6 layout flex flex-col gap-2">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
      >
        <Alert
          :icon="notificationMap[notification.type].icon"
          :color="notificationMap[notification.type].color"
          @click="removeNotification(notification.id)"
          >{{ notification.message }}
        </Alert>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import {
  notificationMap,
} from '@/features/notification/domain/notificationEnum'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import { storeToRefs } from 'pinia'
import Alert from './Alert.vue'

const store = useNotificationStore()
const { notifications } = storeToRefs(store)
const { removeNotification } = store
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.layout{
  z-index: 99999;
}
</style>
