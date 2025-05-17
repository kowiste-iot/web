<template>
  <div
    id="grid-layout"
    class="custom-grid-layout"
    :style="gridContainerStyle"
    ref="gridRef"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  provide,
  reactive,
  watch,
  ref,
  onMounted,
  onUnmounted,
} from 'vue'

interface GridLayoutProps {
  cols: number
  rowHeight: number
  margin: number
  draggable?: boolean
  resizable?: boolean
}

const props = withDefaults(defineProps<GridLayoutProps>(), {
  cols: 12,
  rowHeight: 1.5,
  margin: 0.5,
  draggable: false,
  resizable: false,
})

const gridRef = ref<HTMLElement | null>(null)
const containerHeight = ref(0)
const rowsCount = ref(12) // Default fallback rows

// Calculate how many rows fit in the container
const updateRowsCount = () => {
  if (containerHeight.value > 0) {
    rowsCount.value = Math.floor(containerHeight.value / (props.rowHeight * 16))
  }
}

const layoutConfig = reactive({
  cols: props.cols,
  rows: rowsCount, // Use the ref directly in the reactive object
  rowHeight: props.rowHeight,
  margin: props.margin,
  draggable: props.draggable,
  resizable: props.resizable,
})

// Watch for prop changes and update the reactive object
watch(
  () => props.draggable,
  (newVal) => {
    layoutConfig.draggable = newVal
  }
)

watch(
  () => props.resizable,
  (newVal) => {
    layoutConfig.resizable = newVal
  }
)

// Watch containerHeight changes and update rows
watch(containerHeight, () => {
  updateRowsCount()
})

// Update container height when window resizes, but don't let it grow based on content
const updateContainerHeight = () => {
  if (gridRef.value) {
    const parent = gridRef.value.parentElement
    if (parent) {
      containerHeight.value = parent.clientHeight
      // Set the fixed height on the grid element to prevent it from growing
      gridRef.value.style.height = `${containerHeight.value}px`
    }
  }
}

onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerHeight)
})

// Provide layout configuration to child components
provide('layoutConfig', layoutConfig)

const gridContainerStyle = computed(() => {
  return {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden', // Prevent items from overflowing
  }
})
</script>

<style scoped>
.custom-grid-layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
