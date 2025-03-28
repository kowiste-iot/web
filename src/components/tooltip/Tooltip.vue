<template>
  <div class="tooltip-container">
    <div
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="tooltip-trigger"
    >
      <slot></slot>
    </div>
    <Teleport to="body">
      <div
        v-show="isVisible"
        class="tooltip-content"
        :class="[position, { 'tooltip-content-default': !hasTooltipSlot }]"
        :style="tooltipStyle"
      >
        <slot v-if="hasTooltipSlot" name="tooltip"></slot>
        <template v-else>{{ text }}</template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots, computed, type Slots, onBeforeUnmount } from 'vue'
import { ETooltipPosition } from './ETooltipPosition'

interface Props {
  text?: string
  position?: ETooltipPosition
}

const props = withDefaults(defineProps<Props>(), {
  position: ETooltipPosition.Top,
  text: '',
})
// Add these new variables
const tooltipStyle = ref({})
let triggerElement: HTMLElement | null = null

const slots: Slots = useSlots()
const hasTooltipSlot = computed((): boolean => !!slots.tooltip)
const isVisible = ref<boolean>(false)

let timeoutId: number | null = null

// Update your handleMouseEnter function
function handleMouseEnter(event: MouseEvent): void {
  triggerElement = event.currentTarget as HTMLElement
  timeoutId = window.setTimeout(() => {
    isVisible.value = true
    updateTooltipPosition()
  }, 500)
}

function handleMouseLeave(): void {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  isVisible.value = false
}
function updateTooltipPosition(): void {
  if (!triggerElement) return

  const rect = triggerElement.getBoundingClientRect()
  const tooltipPosition = { top: 0, left: 0 }

  switch (props.position) {
    case ETooltipPosition.Top:
      tooltipPosition.top = rect.top
      tooltipPosition.left = rect.left + rect.width / 2
      break
    case ETooltipPosition.Bottom:
      tooltipPosition.top = rect.bottom
      tooltipPosition.left = rect.left + rect.width / 2
      break
    case ETooltipPosition.Left:
      tooltipPosition.top = rect.top + rect.height / 2
      tooltipPosition.left = rect.left
      break
    case ETooltipPosition.Right:
      tooltipPosition.top = rect.top + rect.height / 2
      tooltipPosition.left = rect.right
      break
  }

  tooltipStyle.value = {
    position: 'fixed',
    top: `${tooltipPosition.top}px`,
    left: `${tooltipPosition.left}px`,
  }
}
onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.tooltip-container {
  display: inline-block;
  position: relative;
}

.tooltip-content {
  position: absolute;
  background: var(--layout-overlay);
  border-radius: var(--border-md);
  border: 1px solid black !important;
  padding: 2px;
  color: black;
  font-size: 14px;
  white-space: nowrap;
  z-index: var(--index-god);
  pointer-events: none;
}

.tooltip-content-default {
  padding: 4px 8px;
  border-radius: 4px;
}

.tooltip-content.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
}

.tooltip-content.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
}

.tooltip-content.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
}

.tooltip-content.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(8px);
}
</style>
