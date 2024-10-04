<template>
  <div>YOU are in asset</div>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
// imports
// stores import
import { useBreadCrumb } from '@/stores/gui/breadcrumb'

// components import
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
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
// model imports
// other imports
// props

// data
const chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }],
}
const chartOptions = {
  responsive: true,
}
// storage calls
useBreadCrumb().set('assets')

// computed
// methods
// lifeCycle
// watch
</script>

<style scoped></style>
