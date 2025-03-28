<template>
  <button
    type="button"
    :class="[
      'switch-button',
      { 
        'switch-checked': modelValue, 
        'switch-disabled': disabled,
        'switch-small': compact
      },
    ]"
    :style="switchStyle"
    @click="handleClick"
    :aria-checked="modelValue"
    role="switch"
  >
    <div class="switch-container">
      <span class="switch-handle"></span>
      <!-- Left icon container -->
      <span class="icon-container icon-left">
        <FIcon v-if="!noIcon" class="switch-icon" :icon="props.onIcon" />
      </span>
      <!-- Right icon container -->
      <span class="icon-container icon-right">
        <FIcon v-if="!noIcon" class="switch-icon" :icon="props.offIcon" />
      </span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { EIcon } from '@/features/shared/enum/EIcon'
import { computed } from 'vue'

const modelValue = defineModel<boolean>({ default: false })

interface Props {
  onColor?: string
  offColor?: string
  handleColor?: string
  onIcon?: string
  offIcon?: string
  noIcon?: boolean
  disabled?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  onColor: '#4ADE80',
  offColor: '#EF4444',
  handleColor: '#FFFFFF',
  onIcon: EIcon.Smile,
  offIcon: EIcon.Sad,
  disabled: false,
  compact: false,
})

const emit = defineEmits<{
  change: []
}>()

const switchStyle = computed(() => ({
  '--on-color': props.onColor,
  '--off-color': props.offColor,
  '--handle-color': props.handleColor,
}))

const handleClick = () => {
  if (!props.disabled) {
    modelValue.value = !modelValue.value
    emit('change')
  }
}
</script>

<style scoped>
.switch-button {
  position: relative;
  width: 5rem;
  height: 2rem;
  padding: 0;
  border: none;
  cursor: pointer;
  background: none;
}

.switch-small {
  width: 3.5rem;
  height: 1.4rem;
}

.switch-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--off-color);
  border-radius: 999px;
  transition: all 0.3s;
}

.switch-checked .switch-container {
  background-color: var(--on-color);
}

.switch-handle {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  background-color: var(--handle-color);
  transition: transform 0.3s;
}

.switch-small .switch-handle {
  top: 0.1rem;
  left: 0.1rem;
  width: 1.2rem;
  height: 1.2rem;
}

.switch-checked .switch-handle {
  transform: translateX(3rem);
}

.switch-small.switch-checked .switch-handle {
  transform: translateX(2.1rem);
}

.icon-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1.7rem;
  height: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.3s;
}

.switch-small .icon-container {
  width: 1.2rem;
  height: 1.2rem;
}

.icon-left {
  left: 0.15rem;
}

.switch-small .icon-left {
  left: 0.1rem;
}

.icon-right {
  right: 0.15rem;
}

.switch-small .icon-right {
  right: 0.1rem;
}

.switch-icon {
  width: 1rem;
  height: 1rem;
}

.switch-small .switch-icon {
  width: 0.7rem;
  height: 0.7rem;
}

.switch-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>