<template>
  <div>YOU are in action</div>
</template>

<script setup lang="ts">
// imports
import {ref} from 'vue'
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'
import { ActionPage } from '@/features/action/presentation/pages/pageAction';
import { useBasePage } from '@/composable/useBasePage';

// components import
// model imports
// other imports
// props

// data
const page = ref(new ActionPage())

// service
const { notificationService } = useBasePage(page.value.title, page.value.path)


// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
