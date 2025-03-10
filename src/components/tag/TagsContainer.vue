<template>
  <div class="chips-container">
    <BaseTag
      v-for="(value, index) in values"
      :key="index"
      :label="getLabel(value)"
      :color="color"
      :deletable="deletable"
      v-show="index < maxVisible"
      @remove="$emit('remove', getValue(value))"
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
}

const props = withDefaults(defineProps<Props<any>>(), {
  maxVisible: 3,
  valueField: 'value',
  labelField: 'label',
  color: EColor.Primary,
  deletable: true,
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
</style>