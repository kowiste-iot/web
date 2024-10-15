<template>
  <div>YOU are in alert</div>
</template>

<script setup lang="ts">
// imports
import {ref} from 'vue'

// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { AlertPage } from '@/model/alert/page/pageAlert';

// components import

// model imports
// other imports
// props

// data
const page = ref(new AlertPage())

// storage calls
useBreadCrumb().set(page.value.title,page.value.path)

// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
