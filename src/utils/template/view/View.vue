<template>
  <div></div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  data?: string
}
const props = withDefaults(defineProps<Props>(), {
  data: '',
})
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

<style scoped></style>
