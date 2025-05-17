# RevealAnimation.vue
<template>
  <div class="reveal-container">
    <div 
      :class="['reveal-content', { 'is-visible': isVisible }]"
      :style="{ 
        transitionDuration: `${props.duration}ms`,
        transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: props.growDirection === EGrow.LEFT ? 'left' : 'right'
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EGrow } from './types';


interface Props {
  delay?: number
  duration?: number
  growDirection?: EGrow
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 1000,
  growDirection: EGrow.LEFT
})

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, props.delay)
})
</script>

<style scoped>
.reveal-container {
  position: relative;
  overflow: hidden;
}

.reveal-content {
  transition: transform ease-in-out;
  will-change: transform;
}
</style>