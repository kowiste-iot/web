<template>
  <div>
    <label v-if="label" class="p-2">{{ label }}</label>
    <input :type="type" :placeholder="placeholder" :disabled="disabled"/>
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
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "placeholder",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
