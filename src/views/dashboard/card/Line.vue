<template>
  <WidgetCard :data="data" :measureCondition="true">
    <Line
      class="h-100"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
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
}
const props = defineProps<Props>()
const options = computed(() => props.data.options as LineOptions)

const modelValue = defineModel<number>({ default: 0 })

// data
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
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
