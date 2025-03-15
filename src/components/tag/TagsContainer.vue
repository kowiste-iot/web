<template>
  <div class="chips-container" :class="{ 'chips-overlap': overlap }">
    <BaseTag
      v-for="(value, index) in values"
      :key="index"
      :label="getLabel(value)"
      :color="color"
      :deletable="deletable"
      v-show="index < maxVisible"
      @remove="$emit('remove', getValue(value))"
      :class="{ 'chip-overlapped': overlap && index < maxVisible - 1 }"
    />
    <BaseTag
      v-if="values.length > maxVisible"
      :color="color"
      :deletable="false"
      :label="`+${values.length - maxVisible}`"
    />
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@/features/shared/enum/EColor'
import BaseTag from './Tag.vue'

interface Props<T> {
  values: T[]
  maxVisible?: number
  valueField?: keyof T
  labelField?: keyof T
  deletable?: boolean
  color?: EColor
  overlap?: boolean
}

const props = withDefaults(defineProps<Props<any>>(), {
  maxVisible: 3,
  valueField: 'value',
  labelField: 'label',
  color: EColor.Primary,
  deletable: true,
  overlap: false,
})

defineEmits<{
  remove: [value: string | number]
}>()

function getValue(option: any): string | number {
  return option[props.valueField]
}

function getLabel(option: any): string {
  return option[props.labelField]
}
</script>

<style>
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.1rem;
  align-items: center;
}

.chips-overlap {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
}

.chip-overlapped {
  position: relative;
  margin-right: calc(-1 * var(--size-600));
  z-index: var(--index-card-1);
  border: 1px solid #e0e0e0;
}

.chips-overlap .chip-overlapped:hover {
  z-index: var(--index-card-2);
}

.chips-overlap BaseTag:last-of-type,
.chips-overlap BaseTag:nth-last-of-type(2):not(.chip-overlapped) {
  position: relative;
  z-index: var(--index-card-3);
}
</style>
