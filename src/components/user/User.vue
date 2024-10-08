``
<template>
  <div class="position-relative over">
    <div class="px-2" role="button" @click="toggleVisibility">
      <FIcon
        class="pe-3"
        :icon="EIcon.User"
        style="height: 1.2rem; width: 1.2rem"
      />
    </div>
    <div
      v-if="isVisible"
      class="position-absolute top-100 end-0 border rounded bg-white py-2 px-3"
      style="min-width: 10rem; width: 20rem"
      @mouseleave="toggleVisibility"
    >
      <div class="ms-3 mt-3">
        <div class="btn d-flex">
          <FIcon class="pt-1" :icon="EIcon.User" />
          <div class="ms-4 w-auto">Profile</div>
        </div>
        <div class="btn d-flex">
          <FIcon class="pt-1" :icon="EIcon.Admin" />
          <div class="ms-4 w-auto">Settings</div>
        </div>
      </div>

      <div class="btn d-flex border-top mt-4">
        <FIcon class="pt-1" :icon="EIcon.LogOut" />
        <div class="ms-4 w-auto">Log out</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, computed } from 'vue'

// stores import
import { useAlert } from '@/stores/gui/alert'

// components import

// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { EColor } from '@/enums/gui/EColor'
import { ENotificationSeverity } from '@/enums/notification/ENotificationSeverity'
import { Property } from '@/model/property'
import { Notification } from '@/model/model copy/notification'
import Input from '@/components/form/Input.vue'


// other imports
// props
const props = defineProps({
  data: {
    type: Array<Property>,
    default: [],
  },
  onClick: {
    type: Function,
    default: function () {},
  },
})
// data
const isVisible = ref(false)
const isHover = ref({} as { [key: number]: boolean })
// storage calls

// computed
let userMenu = new Array<Property>()

userMenu.push({
  id: 1,
  icon: EIcon.User,
  name: 'Profile',
  option: { tabulation: true },
})
userMenu.push({
  id: 2,
  icon: EIcon.Admin,
  name: 'Settings',
  option: { tabulation: true },
})
userMenu.push({
  id: 3,
  icon: EIcon.Death,
  name: 'Log out',
  option: { line: true },
})

// methods
function toggleVisibility() {
  console.log('sf')

  isVisible.value = !isVisible.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
