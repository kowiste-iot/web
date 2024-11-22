<template>
  <WidgetCard :data="data" :measureCondition="calculateMeasureCondition">
    <Line class="h-100" :options="chartOptions" :data="chartData" />
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js'
import { computed } from 'vue'
import WidgetCard from './WidgetCard.vue'
import type { IWidgetData } from '@/model/widget/widget'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
)
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
}
interface LineOptions {
  showLegend: boolean
  fill: boolean
  color: string
  max: number
  min: number
}
const props = defineProps<Props>()
const options = computed(() => props.data.options as LineOptions)

const modelValue = defineModel<number[]>({ default: [0] })

// data

// storage calls
// computed
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: options.value.showLegend ? true : false,
        position: 'top' as const,
      },
    },
  }
})

const chartData = computed(() => {
  return {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: 'Monthly Data',
        data: [40, 20, 12],
        borderColor: options.value.color,
        backgroundColor: options.value.color + '33', //add transparency
        borderWidth: 2,
        fill: options.value.fill ? true : false,
        tension: 0.1,
      },
    ],
  }
})
const lastValue = computed(() => {
  return modelValue.value[modelValue.value.length - 1]
})

const calculateMeasureCondition = computed(() => {
  const { max, min } = options.value
  const value = lastValue.value

  if (max !== undefined && min !== undefined) {
    return value >= min && value <= max
  }
  if (max !== undefined) {
    return value <= max
  }
  if (min !== undefined) {
    return value >= min
  }
  return false
})
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
