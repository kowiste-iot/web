<template>
  <div class="slide">
    <div class="alert alert-light d-flex p-0 position-relative">
      <div
        class="rounded-start top-0 bottom-0 d-flex align-items-center justify-content-center px-2 position-absolute full-height"
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
      <div class="d-flex align-items-center p-2 flex-grow-1 text-break ps-5">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  color: string
}
const props = withDefaults(defineProps<Props>(), {
  icon: '',
  color: '',
})
</script>

<style scoped></style>
