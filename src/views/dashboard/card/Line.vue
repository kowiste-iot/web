<template>
  <div class="h-100 d-flex flex-column">
    <Line
      class="h-100"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div class="border-top">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
// stores import
// components import\
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
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
})
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
