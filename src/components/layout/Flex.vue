<template>
  <div
    class="d-flex"
    :class="[
      reverse ? 'flex-row-reverse' : '',
      gap ? `gap-${gap}` : '',
      column ? (reverse ? 'flex-column-reverse ' : 'flex-column') : '',
      justify ? justify : '',
      fullHeight ? 'flex-grow-1' : '',
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { EFlexJustify } from './EFlex'

// imports
// stores import
// components import
// model imports
// other imports
// props

interface Props {
  reverse?: boolean
  column?: boolean
  justify?: EFlexJustify
  fullHeight?: boolean
  gap?: number //Maybe pass to xsmalll, smal,... and use spacing variable
}
const props = withDefaults(defineProps<Props>(), {})
// data
//service
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
