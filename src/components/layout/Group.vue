<template>
  <div class="group-layout">
    <span class="group-text">{{ groupText }}</span>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
interface Props {
  groupText?: string
}

const props = defineProps<Props>()
</script>
<style scoped>
.group-layout {
  margin-top: var(--size-100);
  padding: var(--size-100);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-md);
  position: relative;
}
.group-text {
  position: absolute;
  top: calc(-1 * var(--size-150));
  left: var(--size-200);
  background-color: var(--background-color, white);
  padding: 0 var(--size-100);
  font-size: small;
}
</style>
