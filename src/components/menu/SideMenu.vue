<template>
  <div class="text-white position-relative " :class="`bg-${EColor.Dark}`">
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
import { useI18n } from 'vue-i18n'

// components import
import Logo from '@/components/icons/Logo.vue'
import ElementMenu from '@/components/menu/ElementMenu.vue'

// model imports
import { type IMenu } from '@/model/gui/menu'
import { EIcon } from '@/enums/gui/EIcon'
import { EColor } from '@/enums/gui/EColor'

// other imports
// props
// data
const { t } = useI18n()

const menu = ref([
  {
    label: 'menu.dashboard',
    icon: EIcon.Dashboard,
    isParent: true,
    path: '/dashboard',
  },
  {
    label: 'menu.asset',
    icon: EIcon.Asset,
    isParent: true,
    path: '/asset',
  },
  {
    label: 'menu.measure',
    icon: EIcon.Measure,
    isParent: true,
    path: '/measure',
  },
  {
    label: 'menu.device',
    icon: EIcon.Device,
    isParent: true,
    path: '/device',
  },
  {
    label: 'menu.process.parent',
    icon: EIcon.Process,
    isParent: true,
    path: '/process',
    subMenu: [
      {
        label: 'menu.process.alert',
        icon: EIcon.Alert,
        path: '/process/alert',
      },
      {
        label: 'menu.process.action',
        icon: EIcon.Action,
        path: '/process/action',
      },
    ],
  },
  { label: 'menu.admin', icon: EIcon.Admin, isParent: true, path: '/admin' },
] as IMenu[])
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
