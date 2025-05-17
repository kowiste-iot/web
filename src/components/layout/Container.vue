<template>
  <div id="main-container" class="main-container">
    <div id="container-inner" class="cont-md">
      <slot></slot>
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
//service
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
.main-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
.cont-md {
  width: 100%;
  height: 100%;
  padding-right: var(--bs-gutter-x, 1rem);
  padding-left: var(--bs-gutter-x, 1rem);
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 768px) {
  .cont-md {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .cont-md {
    max-width: 910px;
  }
}

@media (min-width: 1200px) {
  .cont-md {
    max-width: 1140px;
  }
}

@media (min-width: 1400px) {
  .cont-md {
    max-width: 1320px;
  }
}
</style>
