<template>
  <div class="wrapper">
    <div ref="slider" class="position-relative w-100">
      <div class="track-wrapper">
        <input
          type="range"
          :min="min"
          :max="max"
          v-model="startValue"
        />
        <input
          type="range"
          :min="min"
          :max="max"
          v-model="endValue"
        />
        <div class="track" :class="`bg-${color}`"></div>
        <div
          class="range-between"
          :style="{ left: startPercent + '%', right: 100 - endPercent + '%' }"
        ></div>
        <div
          class="position-absolute"
          :style="{ left: startPercent + '%' }"
          style="height: 1rem; width: 1rem"
        ></div>
        <div
          class="position-absolute"
          :style="{ right: 100 - endPercent + '%' }"
          style="height: 1rem; width: 1rem"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EColor } from '@/enums/gui/EColor'
import {  computed, watch, defineProps, defineModel } from 'vue'

const props = defineProps({
  min: {
    type: Number,
    default: -10,
  },
  max: {
    type: Number,
    default: 200,
  },
  color: {
    type: String,
    default: EColor.Info,
  },
})

const startValue = defineModel('start')
const endValue = defineModel('end')

const startPercent = computed(
  () => ((startValue.value - props.min) / (props.max - props.min)) * 100
)

const endPercent = computed(
  () => ((endValue.value - props.min) / (props.max - props.min)) * 100
)

watch([startValue.value, endValue.value], ([newStart, newEnd]) => {
  if (newStart > newEnd - 10) {
    startValue.value = newEnd - 10
  }
  if (newEnd < newStart + 10) {
    endValue.value = newStart + 10
  }
})
</script>

<style lang="scss" scoped>


.track-wrapper {
  position: relative;
  height: 10px;
  display: flex;
  align-items: center;
}

.track {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  border-radius: 5px;
}

.range-between {
  position: absolute;
  height: 100%;
  background-color: var(--green);
  border-radius: 5px;
}

input[type='range'] {
  position: absolute;
  width: 100%;
  height: 10px;
  -webkit-appearance: none;
  background: transparent;
  pointer-events: none;
  z-index: 2;
  margin: 0;
  padding: 0;
}

input[type='range']::-webkit-slider-thumb {
  pointer-events: all;
  width: 20px;
  height: 20px;
  background-color: var(--green);
  -webkit-appearance: none;
}

input[type='range']::-moz-range-thumb {
  pointer-events: all;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
</style>
