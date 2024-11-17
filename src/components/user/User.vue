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
      class="position-absolute top-100 end-0 border rounded bg-light py-2 px-3"
      style="min-width: 10rem; width: 20rem"
      @mouseleave="toggleVisibility"
    >
      <div class="d-flex">
        <div
          class="bg-success rounded-circle mt-2 me-2 p-2 text-white d-flex justify-content-center align-items-center"
          style="height: 2.5rem; width: 2.5rem"
        >
          {{
            user.charAt(0)?.toUpperCase() +
            user.split(' ')[1]?.charAt(0)?.toUpperCase()
          }}
        </div>
        <div class="flex-fill ps-2">
          <div class="fs-5">{{ user }}</div>
          <div>Role: Admin</div>
        </div>
      </div>
      <div class="ms-3 mt-3">
        <div class="btn d-flex" @click="router.push('/profile')">
          <FIcon class="pt-1" :icon="EIcon.User" />
          <div class="ms-4 w-auto">Profile</div>
        </div>
        <div class="btn d-flex" @click="router.push('/settings')">
          <FIcon class="pt-1" :icon="EIcon.Admin" />
          <div class="ms-4 w-auto">Settings</div>
        </div>
      </div>

      <div class="btn d-flex border-top mt-4">
        <div class="pt-1">
          Kowiste &copy {{ timeToFormat(today(), 'yyyy') }}
        </div>
        <div class="d-flex flex-row-reverse flex-fill">
          <div class="ms-4">Log out</div>
          <FIcon class="pt-1" :icon="EIcon.LogOut" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'

// stores import
import { useRouter } from 'vue-router'

// components import

// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { Property } from '@/model/property'
import { today } from '@/utils/time/time'
import { timeToFormat } from '@/utils/time/conversion'

// other imports
// props

// data
const isVisible = ref(false)
const isHover = ref({} as { [key: number]: boolean })

// storage calls
const router = useRouter()

// computed
const user = 'Pablo Garcia Vivo'
// methods
function toggleVisibility() {
  console.log('sf')

  isVisible.value = !isVisible.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
