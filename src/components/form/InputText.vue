<template>
  <div class="position-relative">
    <div class="d-flex p-1" :class="error ? 'invalid' : ''">
      <label v-if="label" class="p-2">{{ label }}</label>
      <FIcon v-if="icon" class="px-2 pt-2" :icon="icon" />
      <textarea
        class="flex-fill form-control"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        @keyup="internalChange"
        v-model="model"
      />
    </div>
    <div v-if="error" class="mt-0 invalid-feedback d-block">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EIcon } from '@/features/shared/enum/EIcon'

interface Props {
  label?: string
  icon?: EIcon
  placeholder?: string
  disabled?: boolean
  rows?: number

  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'placeholder',
  disabled: false,
  rows: 3,
  onChange: () => {},
})

const model = defineModel<string>()
const emit = defineEmits<{
  change: []
}>()
function internalChange() {
  emit('change')
}
</script>

<style scoped>
.invalid {
  border: 1px solid red;
}

.invalid-feedback {
  color: red;
  font-size: 0.875rem;
}

textarea {
  resize: vertical;
  min-height: 60px;
}
</style>
