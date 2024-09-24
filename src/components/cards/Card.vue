<template>
  <div class="card col-md-6">
    <div class="card-header bg-transparent d-flex justify-content-between">
      <div v-if="headerText">{{ headerText }}</div>
      <i v-if="headerText && icon" :class="icon"></i>
      <slot v-else name="header" />
    </div>
    <div class="card-body text-success">
      <slot />
    </div>
    <div class="card-footer bg-transparent d-flex justify-content-between">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
// other imports
// props
const props = defineProps({
  headerText: {
    type: String,
  },
  icon: {
    type: String,
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
