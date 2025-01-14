<template>
  <div class="d-flex justify-content-end pt-1 text-secondary">
    <div class="flex-fill"><Breadcrumb class="ms-2" /></div>
    <div role="button" @click="fullscreen">
      <FIcon
        class="pe-3"
        :icon="EIcon.Expand"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <AlertNotification />
    <Notification />
    <User />
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Breadcrumb from '@/components/menu/BreadCrumb.vue'
import AlertNotification from '@/features/notification/component/AlertNotification.vue'
import Notification from '@/features/notification/component/Notification.vue'
import User from '@/components/user/User.vue'

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import { EColor } from '@/features/shared/enum/EColor'
// other imports
// props
// data
// storage calls
// computed
// methods
function fullscreen() {
  const element = document.documentElement
  if (!document.fullscreenElement && element?.requestFullscreen) {
    element.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}
// lifeCycle
// watch
</script>

<style scoped></style>
