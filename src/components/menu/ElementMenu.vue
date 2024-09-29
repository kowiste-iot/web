<template>
  <div
    class="d-flex justify-content-between px-3"
    :class="data.isParent ? 'py-2 bg-dark' : 'py-0 bg-secondary'"
  >
    <div class="d-flex" role="button">
      <i class="me-3 pt-1" :class="data.icon"></i>
      <div v-if="isOpen" class=" ">{{ data.label }}</div>
    </div>
    <div v-if="isOpen">
      <i
        v-if="data.subMenu?.length > 0"
        class="ms-3 pt-1"
        :class="open ? EIcon.MenuClose : EIcon.MenuOpen"
        role="button"
        @click="openMenu"
      ></i>

      <div v-else class="ms-3 pt-1" />
    </div>
  </div>
  <div v-if="isOpen">
    <ElementMenu v-for="menu in data.subMenu" :data="menu" :isOpen="isOpen" />
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
// stores import
// components import
// model imports
import { EIcon } from '@/enums/EIcon'
import { type IMenu } from '@/model/navigation/menu'
import type { PropType } from 'vue'
// other imports

// props
const props = defineProps({
  data: {
    type: Object as PropType<IMenu>,
    default: '',
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
})
// data
const open = ref(true)
// storage calls
// computed
// methods
function openMenu() {
  console.log('df', open)
  open.value = !open.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
