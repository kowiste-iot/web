<template>
  <div class="d-flex p-1">
    <label v-if="label" class="p-2">{{ label }}</label>
    <i v-if="icon" class="px-2 pt-2" :class="icon"></i>
    <input
      class="flex-fill form-control"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      @keyup="
        () => {
          onChange()
        }
      "
      v-model="model"
    />
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
  label: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: 'placeholder',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onChange: {
    type: Function,
    default: function () {},
  },
})

const model = defineModel()

// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
