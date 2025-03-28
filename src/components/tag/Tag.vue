<template>
  <div :class="['chip', `chip-${color}`]">
    <FIcon
      v-if="icon"
      class="chip-icon"
      :icon="icon"
      style="height: var(--size-150)"
    />
    {{ label }}
    <span v-if="deletable" class="chip-remove" @click.stop="$emit('remove')"
      >×</span
    >
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@/features/shared/enum/EColor'
import { EIcon } from '@/features/shared/enum/EIcon'

interface Props {
  label: string
  color?: EColor
  icon?: EIcon
  deletable?: boolean
}

withDefaults(defineProps<Props>(), {
  color: EColor.Primary,
  deletable: false,
})

defineEmits<{
  remove: []
}>()
</script>

<style>
.chip {
  --chip-base: var(--component-border-color);
  --chip-text: var(--txt-dark);

  background-color: var(--chip-base);
  color: var(--chip-text);
  border-radius: 1rem;
  padding: var(--size-025) var(--size-150);
  font-size: var(--size-150);
  display: flex;
  align-items: center;
  gap: var(--size-050);
}

.chip-remove {
  cursor: pointer;
  font-weight: bold;
  padding: 0 var(--size-025);
}
.chip-icon {
  transform: translate(calc(-1 * var(--size-050)), 0%);
}
/* Color variants */
.chip-primary {
  --chip-base: var(--color-brand-primary-default);
  --chip-text: var(--text-color-light);
}
.chip-success {
  --chip-base: var(--color-brand-success-default);
  --chip-text: var(--text-color-light);
}
[data-theme='dark'] .chip-success {
  --chip-text: var(--color-nochange-text);
}
.chip-secondary {
  --chip-base: var(--color-brand-secondary-default);
  --chip-text: var(--text-color);
}
[data-theme='dark'] .chip-secondary {
  --chip-text: var(--color-nochange-text);
}
.chip-tertiary {
  --chip-base: var(--color-brand-tertiary-default);
  --chip-text: var(--text-color);
}

.chip-warning {
  --chip-base: var(--color-brand-warning-default);
  --chip-text: var(--text-color);
}
[data-theme='dark'] .chip-warning {
  --chip-text: var(--color-nochange-text);
}
.chip-danger {
  --chip-base: var(--color-brand-danger-dark);
  --chip-text: var(--text-color-inverse);
}
</style>
