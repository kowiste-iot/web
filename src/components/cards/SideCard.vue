<template>
  <div
    class="position-fixed top-0 right-0 h-100 mw-100 slide-in bg-light"
  >
    <div class="h-100 overflow-y-auto ">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
// imports

// stores import
// components import

// model imports
import { EColor } from '@/enums/gui/EColor'
import { EIcon } from '@/enums/gui/EIcon'

// other imports
// props
const props = defineProps({
  onAdd: {
    type: Function,
    default: function () {},
  },
})
// data

// storage calls
// computed
// methods

// lifeCycle
// watch
</script>
<style scoped>

.slide-in {
  z-index: 1050;
  animation: slide-in 1s forwards;
}

@keyframes slide-in {
  from {
    right: -100%;
  }
  to {
    right: 0;
  }
}
</style>
