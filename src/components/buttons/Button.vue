<template>
  <button
    class="btn d-flex"
    :class="
      (outline ? `btn-outline-${color}` : `btn-${color} `) +
      (small ? ' btn-sm' : '') +
      (disabled ? ' disabled' : '')
    "
  >
    <FIcon v-if="icon" class="" :icon="icon" />
    <div v-if="loading"><Spinner /></div>
    <slot/>
  </button>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Spinner from '@/components/loading/Spinner.vue'

// model imports
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'

// other imports
// props
interface Props {
  icon?: EIcon
  color?: EColor
  loading?: boolean
  disabled?: boolean
  outline?: boolean
  small?: boolean
}
const props = withDefaults(defineProps<Props>(), {
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
