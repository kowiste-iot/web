<script lang="ts" setup>
import { EIcon } from '@/enums/gui/EIcon';
import { computed } from 'vue';

const modelValue = defineModel<boolean>({ default: false });

interface Props {
  size?: 'sm' | 'md' | 'lg';
  onColor?: string;
  offColor?: string;
  handleColor?: string;
  onText?: string;
  offText?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  onColor: '#4ADE80',
  offColor: '#EF4444',
  handleColor: '#FFFFFF',
  onText: '',
  offText: '',
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
    container: '40px',    // Container height
    aspect: '2',          // Width will be 80px (40px * 2)
    handle: '34px',       // Handle size
    spacing: '2px',       // Space between handle and container edge
    fontSize: '0.875rem', // Text size
    iconSize: '1rem'      // Icon size
  },
  md: {
    container: '50px',
    aspect: '2',
    handle: '44px',
    spacing: '3px',
    fontSize: '1rem',
    iconSize: '1.2rem'
  },
  lg: {
    container: '60px',
    aspect: '2',
    handle: '54px',
    spacing: '3px',
    fontSize: '1.2rem',
    iconSize: '1.4rem'
  }
};

const sizeStyles = computed(() => ({
  '--container-height': sizeConfig[props.size].container,
  '--container-width': `calc(${sizeConfig[props.size].container} * ${sizeConfig[props.size].aspect})`,
  '--handle-size': sizeConfig[props.size].handle,
  '--handle-spacing': sizeConfig[props.size].spacing,
  '--font-size': sizeConfig[props.size].fontSize,
  '--icon-size': sizeConfig[props.size].iconSize,
}));

const handleClick = () => {
  if (!props.disabled) {
    modelValue.value = !modelValue.value;
  }
};
</script>

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
      <span class="switch-text" :class="{ 'switch-text-checked': modelValue }">
        <div v-if="modelValue">
          <FIcon
            class="pe-3"
            :icon="EIcon.Alert"
            style="height: 1.2rem; width: 1.2rem"
          />
        </div>
        <div v-else>
          <FIcon
            class="pe-3"
            :icon="EIcon.Edit"
            style="height: 1.2rem; width: 1.2rem"
          />
        </div>
      </span>
    </div>
  </button>
</template>

<style scoped>
.switch-button {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  cursor: pointer;
  background: none;
}

.switch-container {
  position: relative;
  width: 100%;
  padding-bottom: 50%; /* This creates a 2:1 aspect ratio */
  background-color: var(--off-color);
  border-radius: 999px;
  transition: all 0.3s;
}

.switch-checked .switch-container {
  background-color: var(--on-color);
}

.switch-handle {
  position: absolute;
  top: 3%;
  left: 1%;
  width: 46%;
  padding-bottom: 46%;
  border-radius: 50%;
  background-color: var(--handle-color);
  transition: transform 0.3s;
}

.switch-checked .switch-handle {
  transform: translateX(110%);
}

.switch-text {
  position: absolute;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: clamp(0.5rem, 3vw, 1.2rem);
  transition: all 0.3s;
}

.switch-text-checked {
  left: 8%;
  right: auto;
}

.switch-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
