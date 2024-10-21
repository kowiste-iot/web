<template>
  <div class="border rounded h-100 d-flex flex-column">
    <div class="d-flex justify-content-center">
      <div
        class="border rounded m-3 w-50 py-3"
        :class="`bg-${data ? EColor.Success : EColor.Danger}`"
      ></div>
    </div>
    <div class="border-top">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\

import { EColor } from '@/enums/gui/EColor'
// model imports
// other imports
// props
const props = defineProps({
  data: {
    type: Boolean,
    default: false,
  },
})
// data

// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
