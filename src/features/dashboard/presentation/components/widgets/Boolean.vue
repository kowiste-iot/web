<template>
  <WidgetCard :data="data" :measureCondition="measureValue">
    <div
      v-if="!data.options?.showText"
      class="border rounded m-1 w-50 py-3"
      :class="`bg-${measureValue ? EColor.Success : EColor.Danger}`"
    />
    <div v-else class="fs-1">
      {{ measureValue ? data.options.trueText : data.options.falseText }}
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
import { ref, watch } from 'vue'
import type { IMeasureData } from '@/features/shared/domain/measureData'
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
}
const props = defineProps<Props>()
const modelValue = defineModel<IMeasureData>()
// data
const measureValue = ref<boolean>(false)

// storage calls
// computed
// methods
// lifeCycle
// watch
watch(
  () => [modelValue.value, props.data.link],
  () => {
    if (
      modelValue.value &&
      modelValue.value.data &&
      props.data.link.length > 0
    ) {
      if (modelValue.value.data[props.data.link[0].tag] != undefined)
        measureValue.value = modelValue.value.data[props.data.link[0].tag]
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<style scoped></style>
