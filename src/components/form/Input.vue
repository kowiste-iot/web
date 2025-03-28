<template>
  <div class="input-general">
    <input
      class="in"
      :type="type"
      :placeholder="disabled ? '' : placeholder"
      :disabled="disabled"
      :required="!!error"
      @keyup="(e: KeyboardEvent) => internalChange(e)"
      @keyup.enter="() => $emit('enter')"
      v-model="model"
    />
    <div v-if="error" class="error-text">
      {{ error }}
    </div>
    <!-- Zero whitespace -->
    <div v-else class="error-text">&#8203;</div>
  </div>
</template>

<script setup lang="ts">
import { type InputTypeHTMLAttribute } from 'vue'

interface Props {
  type?: InputTypeHTMLAttribute
  placeholder?: string
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: 'placeholder',
  disabled: false,
})
const emit = defineEmits<{
  change: [event: KeyboardEvent]
  enter: []
}>()
const model = defineModel()

function internalChange(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('enter')
    return
  }
  emit('change', event)
}
</script>

<style>
/* Inputs styles */
.input-general {
  position: relative;
}
.in {
  padding: var(--size-100) var(--size-200);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-sm);
  background-color: var(--layout-overlay);
  color: var(--txt-dark);
  transition: all 0.2s ease;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}

.in:hover:not(:disabled) {
  border: var(--border-width) solid var(--color-brand-primary-default);
  background-color: var(--elevation-surface-overlay-hovered);
}

.in:disabled {
  background-color: var(--background-color-disabled);
  cursor: not-allowed;
}

.in:focus {
  outline: none;
  border: var(--border-width) solid var(--color-brand-primary-default);
}

.in:invalid {
  border: var(--border-width) solid var(--color-brand-danger-dark);
  color: var(--color-brand-danger-dark);
}

/* Placeholder styling */
.in::placeholder {
  color: var(--text-color-subtle);
}
</style>
