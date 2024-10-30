<template>
  <button
    type="button"
    :class="[
      'switch-button',
      { 'switch-checked': modelValue, 'switch-disabled': disabled },
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
        <FIcon class="switch-icon" :icon="props.onIcon" />
      </span>
      <!-- Right icon container -->
      <span class="icon-container icon-right">
        <FIcon class="switch-icon" :icon="props.offIcon" />
      </span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { EIcon } from '@/enums/gui/EIcon';
import { computed } from 'vue';

const modelValue = defineModel<boolean>({ default: false });

interface Props {
  width?: string;
  onColor?: string;
  offColor?: string;
  handleColor?: string;
  onIcon?: string;
  offIcon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: '5rem', // Default width in rem
  onColor: '#4ADE80',
  offColor: '#EF4444',
  handleColor: '#FFFFFF',
  onIcon: EIcon.Smile,
  offIcon: EIcon.Sad,
  disabled: false,
});

// Helper function to ensure rem units
const ensureRem = (value: string) => {
  // If the value already includes a unit, convert it to rem
  if (value.includes('px')) {
    return `${parseFloat(value) / 16}rem`;
  }
  if (!value.includes('rem')) {
    return `${value}rem`;
  }
  return value;
};

// Compute all dimensions based on the provided width
const dimensions = computed(() => {
  const widthInRem = ensureRem(props.width);
  const width = parseFloat(widthInRem);

  return {
    width: `${width}rem`,
    height: `${width * 0.4}rem`, // Increased to 40% of width
    handleSize: `${width * 0.34}rem`, // Proportionally increased by 60%
    handleSpacing: `${width * 0.0304}rem`, // Proportionally increased by 60%
    iconSize: `${width * 0.2}rem`, // Proportionally increased by 60%
  };
});

const switchStyle = computed(() => ({
  '--switch-width': dimensions.value.width,
  '--switch-height': dimensions.value.height,
  '--handle-size': dimensions.value.handleSize,
  '--handle-spacing': dimensions.value.handleSpacing,
  '--icon-size': dimensions.value.iconSize,
  '--on-color': props.onColor,
  '--off-color': props.offColor,
  '--handle-color': props.handleColor,
}));

const handleClick = () => {
  if (!props.disabled) {
    modelValue.value = !modelValue.value;
  }
};
</script>

<style scoped>
.switch-button {
  position: relative;
  width: var(--switch-width);
  height: var(--switch-height);
  padding: 0;
  border: none;
  cursor: pointer;
  background: none;
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
  top: var(--handle-spacing);
  left: var(--handle-spacing);
  width: var(--handle-size);
  height: var(--handle-size);
  border-radius: 50%;
  background-color: var(--handle-color);
  transition: transform 0.3s;
}

.switch-checked .switch-handle {
  transform: translateX(
    calc(var(--switch-width) - var(--handle-size) - 2 * var(--handle-spacing))
  );
}

.icon-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: var(--handle-size);
  height: var(--handle-size);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.3s;
}
.icon-left {
  left: var(--handle-spacing);
}

.icon-right {
  right: var(--handle-spacing);
}

.switch-icon {
  width: var(--icon-size);
  height: var(--icon-size);
}

.switch-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
