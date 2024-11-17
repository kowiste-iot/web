<template>
  <button
    class="btn d-flex"
    :class="
      (outline ? `btn-outline-${color}` : `btn-${color} `) +
      (small ? ' btn-sm' : '')
    "
  >
    <FIcon v-if="icon" class="far pe-2 pt-1" :icon="icon" />
    <slot />
  </button>
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
interface Props {
  icon?: EIcon
  color?: EColor
  outline?: boolean
  small?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  icon: EIcon.Action,
  color: EColor.Primary,
  outline: false,
  small: false,
})
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
