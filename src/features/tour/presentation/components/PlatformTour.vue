<template>
  <div v-if="isVisible">
    <!-- Background Overlay -->
    <div class="tour-overlay"></div>

    <!-- Highlight Area -->
    <div
      v-if="currentStep?.highlight && highlightPosition"
      class="tour-highlight-area"
      :style="highlightPosition"
    >
      <div class="tour-highlight-border"></div>
    </div>

    <!-- Tour Card -->
    <div
      class="tour-popup"
      :style="popupStyle"
      :class="{ 'with-highlight': currentStep?.highlight }"
    >
      <div class="tour-header">
        <h3>{{ currentStep?.title || 'Tour' }}</h3>
        <button @click="endTour" class="close-button" tabindex="0">×</button>
      </div>

      <div class="tour-content">
        {{ currentStep?.content }}
      </div>

      <div class="tour-progress" v-if="totalSteps > 0">
        {{ currentStepIndex + 1 }} / {{ totalSteps }}
      </div>

      <div class="tour-footer">
        <button
          v-if="currentStepIndex > 0"
          @click="handlePrevious"
          class="tour-button"
          :disabled="isActionPending"
          tabindex="0"
        >
          Previous
        </button>
        <div v-else></div>
        <button
          v-if="hasNextStep"
          @click="handleNext"
          class="tour-button primary"
          :disabled="isActionPending"
          tabindex="0"
        >
          Next
        </button>
        <button
          v-else
          @click="endTour"
          class="tour-button primary"
          tabindex="0"
        >
          Finish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTourStore } from '@/features/tour/stores/useTourStore'
import type { TourStep } from '@/features/tour/domain/tour'
import logger from '@/utils/log/logger'

const router = useRouter()
const tourStore = useTourStore()
const { currentStep, currentStepIndex, isVisible } = storeToRefs(tourStore)

const popupStyle = ref({
  top: '0px',
  left: '0px',
})

const highlightPosition = ref({
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
})

const isActionPending = ref(false)

const hasNextStep = computed(() => {
  const tour = tourStore.currentTour
  if (!tour) return false
  return currentStepIndex.value < tour.steps.length - 1
})

const totalSteps = computed(() => {
  return tourStore.currentTour?.steps.length || 0
})

function findTargetElement(selector: string): Element | null {
  // Split the selector into parts (base selector and inner selectors)
  const [baseSelector, ...innerSelectors] = selector.split('>')

  // Find the base element
  let selectElement = document.querySelector(baseSelector.trim())
  if (selectElement == null) return selectElement
  // If there are inner selectors, traverse through them
  if (selectElement && innerSelectors.length > 0) {
    for (const innerSelector of innerSelectors) {
      const trimmedSelector = innerSelector.trim()
      // Search within the current element
      const found = selectElement.querySelector(trimmedSelector)
      return found
    }
  }

  return selectElement
}

watch(
  currentStep,
  async (step) => {
    if (!step) return

    if (step.route && router.currentRoute.value.path !== step.route) {
      await router.push(step.route)
    }

    if (step.waitForElement) {
      await waitForElement(step.target)
    }

    await updatePositions()
  },
  { immediate: true }
)

// Update positions on window resize
let resizeTimeout: number
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(updatePositions, 100)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('tour-action-complete', handleActionComplete)
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('tour-action-complete', handleActionComplete)
  document.removeEventListener('keydown', handleKeyPress)
  clearTimeout(resizeTimeout)
})

async function handleNext() {
  const step = currentStep.value
  if (!step) return

  if (step.action && !isActionPending.value) {
    await executeStepAction(step)
    if (step.waitForAction) {
      return // Don't proceed until action is completed
    }
  }

  const nextStep = tourStore.currentTour?.steps[currentStepIndex.value + 1]
  if (nextStep?.route && router.currentRoute.value.path !== nextStep.route) {
    await router.push(nextStep.route)
    if (nextStep.waitForElement) {
      await waitForElement(nextStep.target)
    }
  }

  tourStore.nextStep()
}

async function handlePrevious() {
  const prevStep = tourStore.currentTour?.steps[currentStepIndex.value - 1]
  if (prevStep?.route && router.currentRoute.value.path !== prevStep.route) {
    await router.push(prevStep.route)
    if (prevStep.waitForElement) {
      await waitForElement(prevStep.target)
    }
  }

  tourStore.previousStep()
}

function handleKeyPress(event: KeyboardEvent) {
  if (!isVisible.value) return

  switch (event.key) {
    case 'Escape':
      endTour()
      break
    case 'ArrowRight':
    case 'Enter':
      if (hasNextStep.value && !isActionPending.value) {
        handleNext()
      }
      break
    case 'ArrowLeft':
      if (currentStepIndex.value > 0 && !isActionPending.value) {
        handlePrevious()
      }
      break
  }
}

function handleActionComplete() {
  isActionPending.value = false
  if (currentStep.value?.waitForAction) {
    handleNext()
  }
}

function endTour() {
  tourStore.endTour()
}

async function executeStepAction(step: TourStep) {
  if (!step.action) return

  const element = findTargetElement(step.target)
  if (!element) return

  isActionPending.value = true

  try {
    if (step.action.delay) {
      await new Promise((resolve) => setTimeout(resolve, step.action?.delay))
    }

    switch (step.action.type) {
      case 'click':
        simulateClick(element as HTMLElement)
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (step.postActionWait) {
          const duration = step.postActionWait.duration
          if (duration) {
            await new Promise((resolve) => setTimeout(resolve, duration))
          }

          if (step.postActionWait.selector) {
            await waitForElement(step.postActionWait.selector)
          }

          if (step.postActionWait.condition) {
            await new Promise((resolve) => {
              const checkCondition = async () => {
                const result = await step.postActionWait?.condition?.()
                if (result) {
                  resolve(true)
                } else {
                  setTimeout(checkCondition, 100)
                }
              }
              checkCondition()
            })
          }
        }

        window.dispatchEvent(new CustomEvent('tour-action-complete'))
        break
      case 'input':
        if (
          step.action.value &&
          (element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement)
        ) {
          element.value = step.action.value
          element.dispatchEvent(new Event('input'))
          element.dispatchEvent(new Event('change'))
          window.dispatchEvent(new CustomEvent('tour-action-complete'))
        }
        break
      case 'hover':
        element.dispatchEvent(new MouseEvent('mouseover'))
        window.dispatchEvent(new CustomEvent('tour-action-complete'))
        break
      case 'wait':
        await new Promise((resolve) =>
          setTimeout(resolve, step.action?.delay || 1000)
        )
        window.dispatchEvent(new CustomEvent('tour-action-complete'))
        break
      case 'custom':
        if (step.action.callback) {
          await step.action.callback()
        }
        window.dispatchEvent(new CustomEvent('tour-action-complete'))
        break
    }

    if (!step.waitForAction) {
      isActionPending.value = false
    }
  } catch (error) {
    logger.error('Error executing tour action:', error)
    isActionPending.value = false
    window.dispatchEvent(new CustomEvent('tour-action-complete'))
  }
}

function simulateClick(element: HTMLElement) {
  const clickEvents = [
    new MouseEvent('mousedown', { bubbles: true }),
    new MouseEvent('mouseup', { bubbles: true }),
    new MouseEvent('click', { bubbles: true }),
  ]

  clickEvents.forEach((event) => element.dispatchEvent(event))
}

async function waitForElement(selector: string): Promise<void> {
  return new Promise((resolve) => {
    const checkElement = () => {
      const element = findTargetElement(selector)
      if (element) {
        resolve()
      } else {
        requestAnimationFrame(checkElement)
      }
    }
    checkElement()
  })
}

async function updatePositions() {
  if (!currentStep.value) return

  const targetElement = findTargetElement(currentStep.value.target)
  if (!targetElement) {
    if (currentStep.value.skipIfNotFound) {
      handleNext()
    }
    return
  }

  const targetRect = targetElement.getBoundingClientRect()
  const popupElement = document.querySelector('.tour-popup') as HTMLElement
  if (!popupElement) return

  const popupRect = popupElement.getBoundingClientRect()
  const placement = currentStep.value.placement || 'bottom'

  // Update highlight position
  if (currentStep.value.highlight) {
    const padding = 8 // Padding in pixels
    highlightPosition.value = {
      top: `${targetRect.top - padding}px`,
      left: `${targetRect.left - padding}px`,
      width: `${targetRect.width + padding * 2}px`,
      height: `${targetRect.height + padding * 2}px`,
    }
  }

  // Calculate popup position
  let top: number
  let left: number

  switch (placement) {
    case 'top':
      top = targetRect.top - popupRect.height - 10
      left = targetRect.left + (targetRect.width - popupRect.width) / 2
      break
    case 'right':
      top = targetRect.top + (targetRect.height - popupRect.height) / 2
      left = targetRect.right + 10
      break
    case 'left':
      top = targetRect.top + (targetRect.height - popupRect.height) / 2
      left = targetRect.left - popupRect.width - 10
      break
    default: // bottom
      top = targetRect.bottom + 10
      left = targetRect.left + (targetRect.width - popupRect.width) / 2
  }

  // Ensure popup stays within viewport
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  top = Math.max(10, Math.min(top, viewport.height - popupRect.height - 10))
  left = Math.max(10, Math.min(left, viewport.width - popupRect.width - 10))

  popupStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}
</script>

<style scoped>
/* Base overlay that covers the entire screen */
.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5000;
}

/* Highlight area - creates a "window" effect */
.tour-highlight-area {
  position: fixed;
  z-index: 5001;
  background: transparent;
  /* Cut-out effect */
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  /* Ensure the element itself is transparent */
  overflow: visible;
  pointer-events: none;
}

/* Border for the highlighted element */
.tour-highlight-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #4caf50;
  border-radius: 8px;
  /* Enhanced glowing effect */
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3),
              0 0 8px 2px rgba(76, 175, 80, 0.2);
  pointer-events: none;
}

/* Tour popup styling */
.tour-popup {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 300px;
  z-index: 5002;
}

.tour-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tour-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.tour-content {
  padding: 16px;
  line-height: 1.5;
  color: #333;
}

.tour-progress {
  padding: 0 16px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.tour-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.tour-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tour-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tour-button.primary {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.tour-button:hover:not(:disabled) {
  opacity: 0.9;
}

.with-highlight {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
</style>
