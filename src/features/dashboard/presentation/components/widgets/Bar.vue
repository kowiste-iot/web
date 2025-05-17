<template>
  <WidgetCard :data="data" :measureCondition="true">
    <Bar
      class="full-height"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </WidgetCard>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import WidgetCard from '../WidgetCard.vue'
import type { IWidgetData } from '@/features/dashboard/domain/widget'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  data: IWidgetData
}

const props = defineProps<Props>()

const chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Monthly Data',
      data: [40, 20, 12],
      backgroundColor: '#36A2EB33',
      borderColor: '#36A2EB',
      borderWidth: 1,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
  },
}
</script>
