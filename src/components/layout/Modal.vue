<template>
  <div class="modal">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  onCancel?: Function
}
const props = withDefaults(defineProps<Props>(), {
  onCancel: function () {},
})
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  padding-top: 5rem; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.5); /* Black w/ opacity */
}
</style>
