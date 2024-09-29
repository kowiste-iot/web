<template>
  <button
    class="btn d-flex"
    :class="outline ? `btn-outline-${color}` : `btn-${color} `"
  >
    <FIcon
      v-if="icon"
      class="bg-white far rounded-circle p-2"
      :class="color ? `text-${color}` : ''"
      :icon="icon"
    />
    <div class="d-flex align-items-center"><slot /></div>
  </button>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
import { EColor } from '@/enums/EColor'

// other imports
// props
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: EColor.Primary,
  },
  outline: {
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
