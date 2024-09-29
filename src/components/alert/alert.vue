<template>
  <div>
    <div class="alert alert-light d-flex align-items-stretch p-0 flex-wrap">
      <div
        class="rounded-start icon-box d-flex align-items-center justify-content-center px-2"
        :class="`bg-${color}`"
        v-if="color"
      >
        <FIcon
          v-if="icon"
          class="bg-white far rounded-circle p-1"
          :class="color ? `text-${color}` : ''"
          :icon="icon"
          style="height: 1rem; width: 1rem"
        />


      </div>
      <div class="d-flex align-items-center p-2 flex-grow-1 text-break">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
})
</script>

<style scoped></style>
