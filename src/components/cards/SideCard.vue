<template>
  <div class="position-fixed top-0 end-0 h-100 slide-in bg-light" style="max-width: 100vw; width: auto;">
    <div class="h-100 overflow-y-auto overflow-x-hidden">
      <slot />
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

// data

// storage calls
// computed
// methods

// lifeCycle
// watch
</script>

<style scoped>
.slide-in {
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}
</style>