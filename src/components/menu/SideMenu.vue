<template>
  <div class="bg-primary text-white position-relative">
    <Logo class="mb-4 m-3" style="height: 1rem; width: 1rem" />
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
// components import
import Logo from '@/components/icons/Logo.vue'
import ElementMenu from '@/components/menu/ElementMenu.vue'

// model imports
import { type IMenu } from '@/model/navigation/menu'
import { EIcon } from '@/enums/EIcon'

// other imports
// props
// data
const menu = [
  { label: 'Home', icon: EIcon.Cancel, isParent: true },
  {
    label: 'Asset',
    icon: EIcon.Cancel,
    isParent: true,
    subMenu: [{ label: 'Build 1' }],
  },
  { label: 'Measure', icon: EIcon.Cancel, isParent: true },
] as IMenu[]
const isOpen = ref(true)
// storage calls
// computed
// methods
function switchMenu() {
  isOpen.value = !isOpen.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
