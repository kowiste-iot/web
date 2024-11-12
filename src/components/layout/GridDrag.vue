<template>
  <div class=" h-100">
    <div class="position-absolute  w-100 h-100 container-d">
      <div v-for="n in 3" class="bg-secondary  opacity-50 rounded h-100">d</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  options: {
    type: Array<any>,
    default: [],
  },
  columns: {
    type: Number,
    default: 12,
  },
})
</script>
<style scoped>
.container-d {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.2rem; /* Add some space between columns if needed */
}


</style>
