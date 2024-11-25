<script lang="ts" setup>
import { shallowRef, onMounted, onUnmounted, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js'
import 'chartjs-adapter-luxon'
import { DateTime } from 'luxon'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
)

interface Props {
  duration: number // duration in minutes
  horizontalLabels?: boolean // new prop for label orientation
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5,
  horizontalLabels: false,
})

interface DataPoint {
  value: number
  timestamp: number
}

const dataPoints = shallowRef<DataPoint[]>([])

const chartData = shallowRef({
  datasets: [
    {
      label: 'Real-time Data',
      data: [] as { x: number; y: number }[],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,
    },
  ],
})

const formatFullDateTime = (timestamp: number): string => {
  return DateTime.fromMillis(timestamp).toFormat('MMM d, yyyy, HH:mm:ss')
}

// Computed chart options based on props
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 100,
    },
    x: {
      type: 'time' as const,
      time: {
        unit: props.duration < 60 ? ('second' as const) : ('minute' as const),
        displayFormats: {
          second: 'HH:mm:ss',
          minute: 'HH:mm',
          hour: 'HH:mm',
          day: 'MMM d HH:mm',
        },
      },
      ticks: {
        maxRotation: props.horizontalLabels ? 0 : 45,
        minRotation: props.horizontalLabels ? 0 : 45,
        autoSkip: true,
        maxTicksLimit: props.horizontalLabels ? 8 : 10, // Reduce number of labels when horizontal
        padding: props.horizontalLabels ? 8 : 4, // Add more padding for horizontal labels
      },
    },
  },
  animation: {
    duration: 0,
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: (context: any) => {
          const timestamp = context[0].raw.x
          return formatFullDateTime(timestamp)
        },
      },
    },
  },
}))

let intervalId: number | null = null

const filterOldData = () => {
  const cutoffTime = Date.now() - props.duration * 60 * 1000
  return dataPoints.value.filter((point) => point.timestamp >= cutoffTime)
}

const updateChartData = () => {
  const filteredData = filterOldData()
  dataPoints.value = filteredData

  chartData.value = {
    datasets: [
      {
        label: 'Real-time Data',
        data: filteredData.map((point) => ({
          x: point.timestamp,
          y: point.value,
        })),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  }
}

const addData = () => {
  const now = DateTime.now()
  const newValue = Math.floor(Math.random() * 100)

  dataPoints.value = [
    ...dataPoints.value,
    {
      value: newValue,
      timestamp: now.toMillis(),
    },
  ]

  updateChartData()
}

onMounted(() => {
  addData()
  intervalId = window.setInterval(addData, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    window.clearInterval(intervalId)
  }
})

watch(
  () => props.duration,
  () => {
    updateChartData()
  }
)
</script>

<template>
  <div style="height: 60vh; width: 80vw">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
