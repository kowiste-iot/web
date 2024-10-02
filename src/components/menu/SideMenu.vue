<template>
  <div class="bg-primary text-white position-relative">
    <Logo
      class="mb-4 m-3"
      style="height: 1rem; width: 1rem"
      role="button"
      @click="goToHome"
    />
    <div
      class="position-absolute start-100 translate-middle"
      @click="switchMenu"
    >
      <FIcon
        class="bg-success rounded-circle p-1"
        :icon="isOpen ? EIcon.MenuLeft : EIcon.MenuRight"
        style="height: 1rem; width: 1rem"
      />
    </div>
    <div class="mb-3"></div>
    <div class="d-flex flex-column">
      <div v-for="element in menu">
        <ElementMenu :data="element" :isOpen="isOpen" />
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
import Logo from '@/components/icons/Logo.vue'
import ElementMenu from '@/components/menu/ElementMenu.vue'

// model imports
import { type IMenu } from '@/model/gui/menu'
import { EIcon } from '@/enums/gui/EIcon'

// other imports
// props
// data
const menu = [
  {
    label: 'Dashboard',
    icon: EIcon.Dashboard,
    isParent: true,
    path: '/dashboard',
  },
  {
    label: 'Asset',
    icon: EIcon.Asset,
    isParent: true,
    path: '/asset',
    subMenu: [{ label: 'Build 1' }],
  },
  { label: 'Measure', icon: EIcon.Measure, isParent: true, path: '/measure' },
  { label: 'Device', icon: EIcon.Device, isParent: true, path: '/device' },
  { label: 'Process', icon: EIcon.Process, isParent: true, path: '/process' },
  { label: 'Admin', icon: EIcon.Admin, isParent: true, path: '/admin' },
] as IMenu[]
const isOpen = ref(true)
// storage calls
const router = useRouter()
// computed
// methods
function switchMenu() {
  isOpen.value = !isOpen.value
}
function goToHome() {
  router.push('/')
}
// lifeCycle
// watch
</script>

<style scoped></style>
@/model/gui/menu
