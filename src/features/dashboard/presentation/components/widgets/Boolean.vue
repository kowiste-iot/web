<template>
  <WidgetCard :data="data" :measureCondition="modelValue">
    <div
      v-if="!data.options?.showText"
      class="border rounded m-3 w-50 py-3"
      :class="`bg-${modelValue ? EColor.Success : EColor.Danger}`"
    />
    <div v-else class="fs-1">
      {{ modelValue ? data.options.trueText : data.options.falseText }}
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\

import { EColor } from '@/features/shared/enum/EColor'

import type { IWidgetData } from '@/features/dashboard/domain/widget'
import WidgetCard from '@/features/dashboard/presentation/components/WidgetCard.vue'
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
}
const props = defineProps<Props>()

const modelValue = defineModel<boolean>({ default: false })

// data

// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
