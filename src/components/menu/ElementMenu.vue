<template>
  <div
    class="d-flex justify-content-between px-3"
    :class="data.isParent ? 'py-2 bg-dark' : 'py-0 bg-secondary'"
  >
    <div class="d-flex" role="button">
      <FIcon class="me-3 pt-1" :icon="data.icon" />
      <div v-if="isOpen" class=" ">{{ data.label }}</div>
    </div>
    <div v-if="isOpen">
      <FIcon
        v-if="data.subMenu?.length > 0"
        class="ms-3 pt-1"
        :icon="isExpanded ? EIcon.MenuClose : EIcon.MenuOpen"
        role="button"
        @click="expandMenu"
      />
      <div v-else class="ms-3 pt-1" />
    </div>
  </div>
  <div v-if="isExpanded">
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
const isExpanded = ref(false)
// storage calls
// computed
// methods
function expandMenu() {
  isExpanded.value = !isExpanded.value
}
// lifeCycle
// watch
</script>

<style scoped></style>
