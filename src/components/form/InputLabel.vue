<template>
  <div class="input-general">
    <Flex>
      <input class="in" :type="type" :value="value" readonly />
      <FIcon
        v-if="show"
        class="copy-icon"
        :icon="EIcon.Show"
        role="button"
        @click="emit('show')"
      />
      <FIcon
        v-if="copy"
        class="copy-icon"
        :icon="EIcon.Copy"
        role="button"
        @click="emit('copy')"
      />
    </Flex>
  </div>
</template>

<script setup lang="ts">
import { EIcon } from '@/features/shared/enum/EIcon'
import { type InputTypeHTMLAttribute } from 'vue'
import Flex from '../layout/Flex.vue'

interface Props {
  type?: InputTypeHTMLAttribute
  value?: string
  show?: boolean
  copy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  value: '',
  copy: false,
})
const emit = defineEmits<{
  show: []
  copy: []
}>()
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
  flex: 1;
}
.copy-icon {
  padding: var(--size-100);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-sm);
}

.in:hover:not(:disabled) {
  border: var(--border-width) solid var(--color-brand-primary-default);
  background-color: var(--elevation-surface-overlay-hovered);
}

.in:focus {
  outline: none;
  border: var(--border-width) solid var(--color-brand-primary-default);
}

/* Placeholder styling */
.in::placeholder {
  color: var(--text-color-subtle);
}
</style>
