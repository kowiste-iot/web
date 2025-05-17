<template>
  <div class="alert-layout" :class="`alert-${color}`"><slot></slot></div>
</template>

<script setup lang="ts">
import { EColor } from '@/features/shared/enum/EColor'

// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  color: EColor
}
const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped>
.alert-layout {
  width: 100%;
  border-radius: var(--border-sm);
}
.alert-primary {
  background-color: var(--color-brand-primary-subtle);
  border: var(--border-width-wider) solid var(--color-brand-primary-darkest);
  color: var();
}
.alert-danger {
  background-color: var(--color-brand-danger-subtle);
  border: var(--border-width-wider) solid var(--color-brand-danger-darkest);
}
.alert-success {
  background-color: var(--color-brand-success-subtle);
  border: var(--border-width) solid var(--color-brand-success-darkest);
}
.alert-warning {
  background-color: color-mix(
    in srgb,
    var(--color-brand-warning-subtle) 50%,
    transparent
  );
  border: var(--border-width-wider) solid var(--color-brand-warning-darkest);
  color: var(--color-brand-warning-text);
}
.alert-secondary {
  background-color: var(--color-brand-secondary-subtle);
  border: var(--border-width-wider) solid var(--color-brand-secondary-darkest);
}
.alert-tertirary {
  background-color: var(--color-brand-tertirary-subtle);
  border: var(--border-width-wider) solid var(--color-brand-tertirary-darkest);
}
</style>
