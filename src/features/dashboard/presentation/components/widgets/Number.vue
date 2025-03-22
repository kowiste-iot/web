<template>
  <WidgetCard :data="data" :measureCondition="modelValue > 10">
    <div class="fs-1 position-relative">
      {{ modelValue.toFixed(data.options.showDecimal ? 2 : 0) }}
      <div
        v-if="data.options.showUnit"
        class="position-absolute bottom-0 start-100 fs-6 ms-2"
      >
        {{ data.options.unit }}
      </div>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\

import type { IWidgetData } from '@/features/dashboard/domain/widget';
import WidgetCard from '../WidgetCard.vue'
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
}
const props = defineProps<Props>()
const modelValue = defineModel<number>({ default: 0 })

// data

// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
