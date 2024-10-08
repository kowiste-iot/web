<template>
  <div class="bg-light border-secondary border rounded">
    <div class="d-flex justify-content-between">
      <slot name="header" />
    </div>
    <div class="mb-5">
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

<style scoped></style>
