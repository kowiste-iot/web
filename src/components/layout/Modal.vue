<template>
  <div id="modal" class="modal" @click="handleBackgroundClick">
    <Row @click.stop>
      <slot></slot>
    </Row>
  </div>
</template>

<script setup lang="ts">
import Row from './grid/Row.vue'

// imports
// stores import
// components import
// model imports
// other imports
// props
const emit = defineEmits<{
  cancel: []
}>()

// data
// storage calls
// computed
// methods
function handleBackgroundClick() {
  emit('cancel')
}
// lifeCycle
// watch
</script>

<style scoped>
/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: var(--index-modal); /* Sit on top */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow-y: auto; /* Enable scroll if needed */
  overflow-x: hidden;
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: var(--modal-color); /* Black w/ opacity */
}
</style>
