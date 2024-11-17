<template>
  <div class="card bg-light">
    <div v-if="showHeader" class="card-header d-flex justify-content-between">
      <div v-if="headerText">{{ headerText }}</div>
      <FIcon v-if="headerText && icon" :icon="icon" />
      <slot v-else name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="showFooter" class="card-footer d-flex justify-content-between">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  headerText?: string
  icon?: string
  showHeader?: boolean
  showFooter?: boolean
}
const props = defineProps<Props>()
// data
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
