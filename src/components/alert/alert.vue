<template>
  <div>
    <div class="alert alert-light d-flex align-items-stretch p-0 flex-wrap">
      <div
        class="rounded-start icon-box d-flex align-items-center justify-content-center px-2"
        :class="`bg-${color}`"
        v-if="color"
      >
        <i
          class="bg-white far rounded-circle p-1"
          :class="[icon, color ? `text-${color}` : '']"
          v-if="icon"
        ></i>
      </div>
      <div class="d-flex align-items-center p-2 flex-grow-1 text-break">
        <slot />
      </div>
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
