<template>
  <div class="position-relative">
    <div class="d-flex p-1" :class="error ? 'invalid' : ''">
      <label v-if="label" class="p-2">{{ label }}</label>
      <FIcon v-if="icon" class="px-2 pt-2" :icon="icon" />
      <input
        class="flex-fill form-control"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @keyup="internalChange"
        @keyup.enter=""
        v-model="model"
      />
    </div>
    <div v-if="error" class="mt-0 invalid-feedback d-block">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import type { EIcon } from '@/features/shared/enum/EIcon'
import { type InputTypeHTMLAttribute } from 'vue'
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  label?: string
  icon?: EIcon
  type?: InputTypeHTMLAttribute
  placeholder?: string
  disabled?: boolean
  onChange?: Function
  onEnter?: Function
  error?: string
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
  type: 'text',
  placeholder: 'placeholder',
  disabled: false,
  onChange: function () {},
  onEnter: function () {},
})

const model = defineModel()

// data
// storage calls
// computed
// methods
function internalChange(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    props.onEnter()
    return
  }
  props.onChange()
}
// lifeCycle
// watch
</script>

<style scoped></style>
