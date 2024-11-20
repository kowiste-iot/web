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
  LinearScale
)
// model imports
// other imports
// props
interface Props {
  data: IWidgetData
}
interface GaugeOptions {
  min: number
  max: number
  startAngle: number
  endAngle: number
  goodLimit: number
  warningLimit: number
  thickness: number
  borderColor: string
  borderWidth: number
}
const props = defineProps<Props>()
const options = computed(() => props.data.options as GaugeOptions)

const modelValue = defineModel<number>({ default: 0 })

// data
const chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }],
}
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
// storage calls
// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
