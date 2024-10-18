<template>
  <div
    class="d-flex justify-content-between px-3"
    :class="
      data.isParent ? `py-2 bg-${EColor.Menu}` : `py-0 bg-${EColor.MenuBg}`
    "
  >
    <div class="d-flex" role="button" @click="goToPath(data.path)">
      <FIcon class="pt-1" :icon="data.icon" />
      <div v-if="isOpen" class="ms-3">{{ $t(data.label) }}</div>
    </div>
    <div v-if="isOpen">
      <FIcon
        v-if="data.subMenu?.length > 0"
        class="ms-3"
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
import { useRouter } from 'vue-router'

// components import
// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { type IMenu } from '@/model/gui/menu'
import type { PropType } from 'vue'
import { EColor } from '@/enums/gui/EColor'
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
const router = useRouter()

// computed
// methods
function expandMenu() {
  isExpanded.value = !isExpanded.value
}
function goToPath(data: string) {
  router.push(data)
}
// lifeCycle
// watch
</script>

<style scoped></style>
@/model/gui/menu
