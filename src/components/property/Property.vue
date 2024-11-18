``
<template>
  <div class="position-relative">
    <div class="px-2" role="button" @click="toggleVisibility">
      <FIcon :icon="EIcon.Property" />
    </div>
    <div
      v-if="isVisible"
      class="position-absolute top-0 card"
      ref="popupDiv"
      :class="leftAlign ? 'start-100' : 'end-100'"
      @mouseleave="toggleVisibility"
    >
      <div v-for="element in data" class="">
        <div
          class="btn d-flex"
          :class="isHover[element.id] ? 'bg-secondary' : 'bg-light'"
          @click="onClick(element)"
          @mouseover="isHover[element.id] = true"
          @mouseleave="isHover[element.id] = false"
        >
          <FIcon :icon="element.icon" />
          <div class="ms-4">{{ element.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { ref, watch } from 'vue'

// stores import
// components import
// model imports
import { EIcon } from '@/enums/gui/EIcon'
import { Property } from '@/model/property'

// other imports
// props
interface Props {
  data?: Property[]
  inverse?: boolean
  onClick?: Function
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  inverse: false,
  onClick: function () {},
})
// data
const isVisible = ref(false)
const isHover = ref({} as { [key: number]: boolean })
const leftAlign = ref(true)
const popupDiv = ref<HTMLElement | null>(null)
// storage calls
// computed
// methods
function toggleVisibility() {
  isVisible.value = !isVisible.value
  leftAlign.value = true
}
const adjustPosition = () => {
  if (popupDiv.value) {
    const rect = popupDiv.value.getBoundingClientRect()
    leftAlign.value = rect.right > window.innerWidth ? false : true
  }
}
// lifeCycle
// watch
watch(
  () => popupDiv.value,
  () => {
    adjustPosition()
  }
)
</script>

<style scoped>
.menu {
  z-index: 1000;
}
</style>
