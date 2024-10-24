<template>
  <div ref="sliderRef" class="relative w-full">
    <svg
      :width="containerWidth"
      :height="containerHeight"
      class="absolute top-0 left-0"
    >
      <!-- Base line -->
      <line
        :x1="handleRadius"
        :y1="containerHeight / 2"
        :x2="containerWidth - handleRadius"
        :y2="containerHeight / 2"
        :stroke="lineColor"
        stroke-width="2"
      />

      <!-- Handles -->
      <template v-for="(position, index) in handlePositions" :key="index">
        <circle
          :cx="position"
          :cy="containerHeight / 2"
          :r="handleRadius"
          :fill="lineColor"
          class="cursor-pointer"
          @mousedown="startDragging(index, $event)"
        />
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  handles: number
  lineColor?: string
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  lineColor: '#3498db',
  min: 0,
  max: 100,
})

const modelValue = defineModel<number[]>({ default: [] })

const sliderRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)
const isDragging = ref(false)
const currentHandleIndex = ref(-1)
const handleRadius = 10
const handlePositions = ref<number[]>([])

const updateContainerSize = () => {
  if (sliderRef.value) {
    containerWidth.value = sliderRef.value.clientWidth
    containerHeight.value = handleRadius * 4 // Height is relative to handle size
  }
}

const initializeHandles = () => {
  if (modelValue.value.length === props.handles) {
    handlePositions.value = modelValue.value.map(
      (value) =>
        ((value - props.min) / (props.max - props.min)) * containerWidth.value
    )
  } else {
    // Distribute handles evenly if no initial values provided
    handlePositions.value = Array.from(
      { length: props.handles },
      (_, i) => (containerWidth.value / (props.handles + 1)) * (i + 1)
    )
    // Update model with initial values
    modelValue.value = handlePositions.value
      .map((pos) => {
        const percentage = pos / containerWidth.value
        return Math.round(percentage * (props.max - props.min) + props.min)
      })
      .sort((a, b) => a - b)
  }
}

const startDragging = (index: number, event: MouseEvent) => {
  isDragging.value = true
  currentHandleIndex.value = index
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDragging)
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value || !sliderRef.value) return

  const sliderRect = sliderRef.value.getBoundingClientRect()
  let newPosition = event.clientX - sliderRect.left

  // Constrain to slider bounds
  newPosition = Math.max(
    handleRadius,
    Math.min(containerWidth.value - handleRadius, newPosition)
  )

  handlePositions.value[currentHandleIndex.value] = newPosition

  // Update model with new values
  modelValue.value = handlePositions.value
    .map((pos) => {
      const percentage = pos / containerWidth.value
      return Math.round(percentage * (props.max - props.min) + props.min)
    })
    .sort((a, b) => a - b)
}

const stopDragging = () => {
  isDragging.value = false
  currentHandleIndex.value = -1
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDragging)
}

// Handle window resize
const handleResize = () => {
  updateContainerSize()
  // Recalculate handle positions based on new width
  if (modelValue.value.length === props.handles) {
    handlePositions.value = modelValue.value.map(
      (value) =>
        ((value - props.min) / (props.max - props.min)) * containerWidth.value
    )
  }
}

// Watch for external value changes
watch(
  () => modelValue.value,
  (newValues) => {
    if (newValues.length === props.handles && containerWidth.value > 0) {
      handlePositions.value = newValues.map(
        (value) =>
          ((value - props.min) / (props.max - props.min)) * containerWidth.value
      )
    }
  },
  { deep: true }
)

onMounted(() => {
  updateContainerSize()
  initializeHandles()
  window.addEventListener('resize', handleResize)
})

// Clean up resize listener
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
