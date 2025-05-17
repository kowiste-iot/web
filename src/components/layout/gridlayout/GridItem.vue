<template>
  <div
    class="custom-grid-item"
    :class="{ draggable: isDraggable, resizable: isResizable }"
    :style="itemStyle"
    :data-key="itemI"
    :data-i="itemI"
    ref="itemRef"
    @mousedown.prevent="onMouseDown"
  >
    <slot></slot>
    <div
      v-if="isResizable"
      class="resize-handle"
      @mousedown.stop.prevent="onResizeStart"
    >
      <FIcon
        class="pe-3"
        :icon="EIcon.Resize"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EIcon } from '@/features/shared/enum/EIcon'
import { computed, inject, ref, onMounted, onUnmounted, watch } from 'vue'

interface LayoutConfig {
  cols: number
  rows: { value: number}  // Now a computed property that updates dynamically
  rowHeight: number
  margin: number
  draggable: boolean
  resizable: boolean
}

interface GridItemProps {
  i: string | number
  x: number
  y: number
  w: number
  h: number
  zIndex?: number
}

interface MoveEvent {
  i: string | number
  x: number
  y: number
  w: number
  h: number
}

const props = withDefaults(defineProps<GridItemProps>(), {
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  zIndex: 1,
})

const itemRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const startX = ref(0)
const startY = ref(0)
const startWidth = ref(0)
const startHeight = ref(0)
const startItemX = ref(0)
const startItemY = ref(0)
const currentX = ref(props.x)
const currentY = ref(props.y)
const currentW = ref(props.w)
const currentH = ref(props.h)

// Emit events
const emit = defineEmits<{
  (e: 'moved', event: MoveEvent): void
  (e: 'resized', event: MoveEvent): void
}>()

// Inject layout configuration from parent
const layoutConfig = inject('layoutConfig') as LayoutConfig

// Compute if item is draggable and resizable
const isDraggable = computed(() => layoutConfig.draggable)
const isResizable = computed(() => layoutConfig.resizable)

// Use i as provided
const itemI = computed(() => props.i)

// Get current available rows
const availableRows = computed(() => {
  return layoutConfig.rows.value || 12;
})

// Calculate item style based on position and dimensions
const itemStyle = computed(() => {
  return {
    position: 'absolute' as const,
    left: `${currentX.value * (100 / layoutConfig.cols)}%`,
    top: `${
      currentY.value * (layoutConfig.rowHeight + layoutConfig.margin * 2)
    }rem`,
    width: `${currentW.value * (100 / layoutConfig.cols)}%`,
    height: `${currentH.value * layoutConfig.rowHeight}rem`,
    zIndex: props.zIndex,
  }
})

// Initialize current position and dimensions from props
onMounted(() => {
  currentX.value = props.x
  currentY.value = props.y
  currentW.value = props.w
  currentH.value = props.h
})

// Watch for changes in grid dimensions
watch(availableRows, (newRows) => {
  // Ensure the item stays within grid bounds
  if (currentY.value + currentH.value > newRows) {
    // If item would be outside grid, adjust y position or height
    if (newRows - currentH.value >= 0) {
      // Move it up
      currentY.value = newRows - currentH.value;
    } else {
      // Resize it to fit within available space
      currentY.value = 0;
      currentH.value = Math.max(1, newRows);
    }
    
    // Emit the change
    emit('moved', {
      i: props.i,
      x: currentX.value,
      y: currentY.value,
      w: currentW.value,
      h: currentH.value,
    });
  }
})

// Watch for changes in props to ensure they stay within grid bounds
watch(() => props.y, (newY) => {
  if (newY + currentH.value > availableRows.value) {
    currentY.value = Math.max(0, availableRows.value - currentH.value);
  } else {
    currentY.value = newY;
  }
})

watch(() => props.h, (newH) => {
  if (currentY.value + newH > availableRows.value) {
    currentH.value = Math.max(1, availableRows.value - currentY.value);
  } else {
    currentH.value = newH;
  }
})

const onMouseDown = (e: MouseEvent) => {
  if (!isDraggable.value || isResizing.value) return

  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startItemX.value = currentX.value
  startItemY.value = currentY.value

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value && !isResizing.value) return

  const gridContainer = itemRef.value?.parentElement
  if (!gridContainer) return

  const rect = gridContainer.getBoundingClientRect()
  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value

  // Get the maximum allowed rows based on the container's fixed height
  const maxRows = availableRows.value

  if (isDragging.value) {
    // Calculate grid position based on mouse movement
    const colWidth = rect.width / layoutConfig.cols
    const rowHeight = layoutConfig.rowHeight * 16 // Convert rem to pixels approximately

    const newX = Math.max(
      0,
      Math.min(
        layoutConfig.cols - currentW.value,
        Math.round(startItemX.value + deltaX / colWidth)
      )
    )
    
    // Strictly enforce the grid boundary
    const newY = Math.max(
      0,
      Math.min(
        maxRows - currentH.value,
        Math.round(startItemY.value + deltaY / rowHeight)
      )
    )

    if (newX !== currentX.value || newY !== currentY.value) {
      currentX.value = newX
      currentY.value = newY
    }
  } else if (isResizing.value) {
    // Calculate new dimensions based on mouse movement
    const colWidth = rect.width / layoutConfig.cols
    const rowHeight = layoutConfig.rowHeight * 16 // Convert rem to pixels approximately

    const newW = Math.max(
      1,
      Math.min(
        layoutConfig.cols - currentX.value,
        Math.round(startWidth.value + deltaX / colWidth)
      )
    )
    
    // Strictly enforce height boundaries based on the fixed container height
    const newH = Math.max(
      1,
      Math.min(
        maxRows - currentY.value,
        Math.round(startHeight.value + deltaY / rowHeight)
      )
    )

    if (newW !== currentW.value || newH !== currentH.value) {
      currentW.value = newW
      currentH.value = newH
    }
  }
}

const onMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    // Emit moved event with new position
    emit('moved', {
      i: props.i,
      x: currentX.value,
      y: currentY.value,
      w: currentW.value,
      h: currentH.value,
    })
  } else if (isResizing.value) {
    isResizing.value = false
    // Emit resized event with new dimensions
    emit('resized', {
      i: props.i,
      x: currentX.value,
      y: currentY.value,
      w: currentW.value,
      h: currentH.value,
    })
  }

  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const onResizeStart = (e: MouseEvent) => {
  if (!isResizable.value || isDragging.value) return

  isResizing.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startWidth.value = currentW.value
  startHeight.value = currentH.value

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style scoped>
.custom-grid-item {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.1s ease;
  padding: 0;
  user-select: none;
}

.custom-grid-item.draggable {
  cursor: move;
}

.custom-grid-item.draggable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: var(--size-150);
  height: var(--size-200);
  cursor: se-resize;
  color: var(--text-color-subtle);
  border-radius: 0 0 4px 0;
}
</style>