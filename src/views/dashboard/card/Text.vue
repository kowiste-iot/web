<template>
  <WidgetCard
    :data="data"
    :measureCondition="modelValue == data.options.conditionText"
  >
    <div>{{ modelValue }}</div>
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\

import WidgetCard from './WidgetCard.vue';
import type { IWidgetData } from '@/model/widget/widget';
// model imports
// other imports
// props
interface Props {
  data: IWidgetData;
}
const props = defineProps<Props>();
const modelValue = defineModel<string>();
// data

// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
