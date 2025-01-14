<template>
  <div ref="sliderRef" class="relative w-full">
    <svg
      :width="data.containerWidth"
      :height="data.containerHeight"
      class="absolute top-0 left-0"
    >
      <!-- Base line -->
      <line
        :x1="data.handleRadius"
        :y1="data.containerHeight / 2"
        :x2="data.containerWidth - data.handleRadius"
        :y2="data.containerHeight / 2"
        :stroke="lineColor"
        stroke-width="2"
      />

      <!-- Single Handle -->
      <circle
        :cx="data.handlePosition"
        :cy="data.containerHeight / 2"
        :r="data.handleRadius"
        :fill="lineColor"
        class="cursor-pointer"
        @mousedown="startDragging"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue'

interface Props {
  lineColor?: string
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  lineColor: '#3498db',
  min: 0,
  max: 100,
})

const modelValue = defineModel<number>({ default: 0 })

const sliderRef = ref<HTMLDivElement | null>(null)

class Slider {
  containerWidth: number
  containerHeight: number
  handleRadius: number
  handlePosition: number
  isDragging: boolean
  constructor() {
    this.containerWidth = 0
    this.containerHeight = 0
    this.handleRadius = 10
    this.handlePosition = this.handleRadius
    this.isDragging = false
  }
  // Convert a value to its corresponding position on the slider
  valueToPosition(value: number): number {
    const range = props.max - props.min
    const percentage = (value - props.min) / range
    const usableWidth = this.containerWidth - this.handleRadius * 2
    return this.handleRadius + percentage * usableWidth
  }
  // Convert a position to its corresponding value
  positionToValue(position: number): number {
    const usableWidth = this.containerWidth - this.handleRadius * 2
    const percentage = (position - this.handleRadius) / usableWidth
    const range = props.max - props.min
    const rawValue = percentage * range + props.min
    return Math.min(Math.max(Math.round(rawValue), props.min), props.max)
  }
  updateContainerSize() {
    if (sliderRef.value) {
      this.containerWidth = sliderRef.value.clientWidth
      this.containerHeight = this.handleRadius * 4
    }
  }
}
let data = reactive(new Slider())



const initializeHandle = () => {
  data.handlePosition = data.valueToPosition(modelValue.value)
}

const startDragging = (event: MouseEvent) => {
  event.preventDefault() // Prevent text selection while dragging
  data.isDragging = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDragging)
}

const handleDrag = (event: MouseEvent) => {
  if (!data.isDragging || !sliderRef.value) return

  const sliderRect = sliderRef.value.getBoundingClientRect()
  let newPosition = event.clientX - sliderRect.left

  // Constrain to slider bounds
  newPosition = Math.max(
    data.handleRadius,
    Math.min(data.containerWidth - data.handleRadius, newPosition)
  )

  data.handlePosition = newPosition
  const newValue = data.positionToValue(newPosition)
  modelValue.value = newValue
}

const stopDragging = () => {
  data.isDragging = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDragging)
}

// Handle window resize
const handleResize = () => {
  data.updateContainerSize()
  data.handlePosition = data.valueToPosition(modelValue.value)
}

// Watch for external value changes
watch(
  () => modelValue.value,
  (newValue) => {
    if (data.containerWidth > 0) {
      // Ensure the value is within bounds
      const boundedValue = Math.min(Math.max(newValue, props.min), props.max)
      data.handlePosition = data.valueToPosition(boundedValue)
    }
  }
)

onMounted(() => {
  data.updateContainerSize()
  initializeHandle()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.cursor-pointer {
  cursor: pointer;
}
.top-0 {
  top: 0;
}
.left-0 {
  left: 0;
}
.w-full {
  width: 100%;
}
</style>
