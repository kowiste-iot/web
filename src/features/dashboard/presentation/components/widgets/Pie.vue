<template>
  <WidgetCard :data="data" :measureCondition="true">
    <Pie class="full-height" :options="chartOptions" :data="chartData" />
  </WidgetCard>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js'
import WidgetCard from '../WidgetCard.vue'
import type { IWidgetData } from '@/features/dashboard/domain/widget'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

interface Props {
  data: IWidgetData
}

const props = defineProps<Props>()

const chartData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Dataset',
      data: [300, 50, 100],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384CC', '#36A2EBCC', '#FFCE56CC'],
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
