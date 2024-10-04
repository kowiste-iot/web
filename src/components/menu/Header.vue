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
    <div role="button">
      <FIcon
        class="pe-3"
        :icon="EIcon.Notification"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <div role="button">
      <FIcon
        class="pe-3"
        :icon="EIcon.Profile"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Breadcrumb from '@/components/menu/BreadCrumb.vue'
// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { EColor } from '@/enums/gui/EColor'
import AlertNotification from '@/components/alert/AlertNotification.vue'
// other imports
// props
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
})
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
