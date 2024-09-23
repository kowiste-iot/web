<template>
  <button type="button" class="btn d-flex" :class="`btn-${color}`">
    <i class="bg-white far rounded-circle p-2" :class="[icon, color ? `text-${color}` : '']" v-if="icon"></i>
    <div class="d-flex align-items-center"><slot /></div>
  </button>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
// other imports
// props
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
});
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
