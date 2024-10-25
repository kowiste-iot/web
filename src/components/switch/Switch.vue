<script lang="ts" setup>
import { computed } from 'vue';

const modelValue = defineModel<boolean>({ default: false });

interface Props {
  onColor?: string;
  offColor?: string;
  handleColor?: string;
  onText?: string;
  offText?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
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
      { 'switch-checked': modelValue, 'switch-disabled': disabled }
    ]"
    :style="switchStyle"
    @click="handleClick"
    :aria-checked="modelValue"
    role="switch"
  >
    <div class="switch-container">
      <span class="switch-handle"></span>
      <span class="switch-text" :class="{ 'switch-text-checked': modelValue }">
        {{ modelValue ? onText : offText }}
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
  top: 6%;
  left: 1%;
  width: 47%;
  padding-bottom: 47%;
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