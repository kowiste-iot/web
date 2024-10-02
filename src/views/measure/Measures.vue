<template>
  <div>measure</div>
</template>

<script setup lang="ts">
// imports
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
// model imports
// other imports
// props
// data
// storage calls
const storeCrumb = useBreadCrumb()
storeCrumb.set('measure')
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
