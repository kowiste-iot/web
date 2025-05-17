<template>
  <WidgetCard :data="data" :measureCondition="measureValue > 10">
    <div ref="numberContainer" class="widget-number-layout">
      <div ref="numberElement" class="widget-number">
        {{ measureValue.toFixed(data.options.showDecimal ? 2 : 0) }}
      </div>
      <div v-if="data.options.showUnit" class="widget-number-unit-layout">
        {{ data.options.unit }}
      </div>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import type { IWidgetData } from '@/features/dashboard/domain/widget'
import WidgetCard from '../WidgetCard.vue'
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
}
const props = defineProps<Props>()
const modelValue = defineModel<IMeasureData>()
const measureValue = ref<number>(0)

// data
// storage calls
// computed
// methods
// lifeCycle
// watch

// Add resize observer to adjust font size if needed
import { onMounted, ref, watch, computed } from 'vue'
import type { IMeasureData } from '@/features/shared/domain/measureData'

const numberContainer = ref<HTMLElement | null>(null)
const numberElement = ref<HTMLElement | null>(null)

// Compute the number of digits to adjust font size accordingly
const digitCount = computed(() => {
  const numberStr = modelValue.toString()
  return numberStr.replace('.', '').length
})

// Adjust font size based on the width of the container and number of digits
const adjustFontSize = () => {
  if (!numberContainer.value || !numberElement.value) return

  const containerWidth = numberContainer.value.clientWidth
  const containerHeight = numberContainer.value.clientHeight

  // Base size on the smallest dimension (usually height in cards)
  const baseFontSize = Math.min(containerWidth, containerHeight) * 1

  // Reduce size based on number of digits
  const fontSizeReduction = Math.max(1, (digitCount.value - 2) * 0.15)
  const finalFontSize = baseFontSize / fontSizeReduction

  // Apply the calculated font size
  numberElement.value.style.fontSize = `${finalFontSize}px`
}

onMounted(() => {
  if (numberContainer.value) {
    // Initial adjustment
    adjustFontSize()

    // Setup resize observer
    const resizeObserver = new ResizeObserver(() => {
      adjustFontSize()
    })

    resizeObserver.observe(numberContainer.value)

    return () => {
      resizeObserver.disconnect()
    }
  }
})

// Watch for changes in the model value
watch(modelValue, () => {
  adjustFontSize()
})
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

<style scoped>
.widget-number-layout {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
  box-sizing: border-box;
}

.widget-number {
  /* Use viewport width of the container instead of the viewport */
  font-size: min(
    calc(100% / 4),
    3rem
  ); /* Dynamically adjusts based on number of digits */
  line-height: 1;
  text-align: center;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
}

.widget-number-unit-layout {
  position: relative;
  font-size: 1em; /* Relative to parent text size */
  margin-left: var(--size-100);
  margin-top: var(--size-200);
}
</style>
