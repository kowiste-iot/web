<template>
  <button
    type="button"
    :class="[
      'switch-button',
      { 'switch-checked': modelValue, 'switch-disabled': disabled },
    ]"
    :style="[switchStyle, sizeStyles]"
    @click="handleClick"
    :aria-checked="modelValue"
    role="switch"
  >
  <div class="switch-container">
      <span class="switch-handle"></span>
      <!-- Left icon container -->
      <span class="icon-container icon-left">
        <FIcon
          class="switch-icon"
          :icon="props.onIcon"
        />
      </span>
      <!-- Right icon container -->
      <span class="icon-container icon-right">
        <FIcon
          class="switch-icon"
          :icon="props.offIcon"
        />
      </span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { EIcon } from '@/enums/gui/EIcon';
import { computed } from 'vue';

const modelValue = defineModel<boolean>({ default: false });

interface Props {
  size?: 'sm' | 'md' | 'lg';
  onColor?: string;
  offColor?: string;
  handleColor?: string;
  onIcon?: string;
  offIcon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  onColor: '#4ADE80',
  offColor: '#EF4444',
  handleColor: '#FFFFFF',
  onIcon: EIcon.Smile,
  offIcon: EIcon.Sad,
  disabled: false,
});

const switchStyle = computed(() => ({
  '--on-color': props.onColor,
  '--off-color': props.offColor,
  '--handle-color': props.handleColor,
}));

// Size configurations for different switch sizes
const sizeConfig = {
  sm: {
    width: '60px',
    height: '30px',
    handle: '24px',
    spacing: '3px',
    fontSize: '0.875rem',
    iconSize: '1rem',
  },
  md: {
    width: '80px',
    height: '40px',
    handle: '34px',
    spacing: '3px',
    fontSize: '1rem',
    iconSize: '1.2rem',
  },
  lg: {
    width: '100px',
    height: '50px',
    handle: '44px',
    spacing: '3px',
    fontSize: '1.2rem',
    iconSize: '1.4rem',
  },
};

const sizeStyles = computed(() => ({
  '--switch-width': sizeConfig[props.size].width,
  '--switch-height': sizeConfig[props.size].height,
  '--handle-size': sizeConfig[props.size].handle,
  '--handle-spacing': sizeConfig[props.size].spacing,
  '--icon-size': sizeConfig[props.size].iconSize,
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
