<template>
  <WidgetCard :data="data" :measureCondition="calculateMeasureCondition">
    <Line class="h-100" :options="chartOptions" :data="chartData" />
  </WidgetCard>
</template>

<script setup lang="ts">
// imports
import { shallowRef, onMounted, onUnmounted, computed, watch } from 'vue'
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
  TimeScale,
  TimeSeriesScale,
} from 'chart.js'
import WidgetCard from './WidgetCard.vue'

// model imports
import type { IWidgetData } from '@/model/widget/widget'
import type { IDataModel } from '@/model/data/data'
import { DateTime } from 'luxon'
// other imports
// props
interface Props {
  data: IWidgetData
  duration: number // duration in minutes
  horizontalLabels?: boolean // new prop for label orientation
}
interface LineOptions {
  showLegend: boolean
  fill: boolean
  color: string
  max: number
  min: number
}
const props = withDefaults(defineProps<Props>(), {
  duration: 5,
  horizontalLabels: false,
})
const options = computed(() => props.data.options as LineOptions)

const modelValue = defineModel<IDataModel[]>({ default: [] })

// data
const dataPoints = shallowRef<IDataModel[]>([])
let intervalId: number | null = null

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  TimeSeriesScale
)
// storage calls
// computed
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
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
    plugins: {
      legend: {
        display: options.value.showLegend ? true : false,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const timestamp = context[0].raw.x
            return formatFullDateTime(timestamp)
          },
        },
      },
    },
  }
})
const chartData = shallowRef({
  datasets: [
    {
      label: 'Real-time Data',
      data: [] as { x: number; y: number }[],
      borderColor: options.value.color,
      backgroundColor: options.value.color + '33', //add transparency
      borderWidth: 2,
      fill: options.value.fill ? true : false,
      tension: 0.1,
    },
  ],
})

const lastValue = computed(() => {
  return modelValue.value[modelValue.value.length - 1]
})

const calculateMeasureCondition = computed(() => {
  const { max, min } = options.value
  const value = lastValue.value

  // if (max !== undefined && min !== undefined) {
  //   return value >= min && value <= max
  // }
  // if (max !== undefined) {
  //   return value <= max
  // }
  // if (min !== undefined) {
  //   return value >= min
  // }
  return false
})
// methods
function formatFullDateTime(timestamp: number): string {
  return DateTime.fromMillis(timestamp).toFormat('MMM d, yyyy, HH:mm:ss')
}
function filterOldData() {
  const cutoffTime = Date.now() - props.duration * 60 * 1000
  return dataPoints.value.filter((point) => point.ts.getTime() >= cutoffTime)
}
function updateChartData() {
  const filteredData = filterOldData()
  dataPoints.value = filteredData

  chartData.value = {
    datasets: [
      {
        label: 'Real-time Data',
        data: filteredData.map((point) => ({
          x: point.ts.getTime(),
          y: point.values['temperature'],
        })),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  } as any
}
function addData() {
  const now = DateTime.now()
  const newValue = Math.floor(Math.random() * 100)
  const val = { temperature: newValue }
  dataPoints.value = [
    ...dataPoints.value,
    {
      id: 'sdfasdfwe',
      values: val,
      ts: now.toJSDate(),
    },
  ]

  updateChartData()
}

// lifeCycle
// onMounted(() => {
//   addData()
//   intervalId = window.setInterval(addData, 1000)
// })

// onUnmounted(() => {
//   if (intervalId !== null) {
//     window.clearInterval(intervalId)
//   }
// })
onMounted(() => {
  const now = DateTime.now()
  const data = [
    {
      id: '1',
      values: { temperature: 25 },
      ts: now.minus({ minutes: 2 }).toJSDate(),
    },
    {
      id: '2',
      values: { temperature: 30 },
      ts: now.minus({ minutes: 1 }).toJSDate(),
    },
    {
      id: '3',
      values: { temperature: 28 },
      ts: now.toJSDate(),
    },
  ]

  dataPoints.value = data
  updateChartData()
})
// watch
watch(
  () => props.duration,
  () => {
    updateChartData()
  }
)
watch(modelValue, (newValue) => {
  if (newValue.length > 0) {
    const latest = newValue[newValue.length - 1]
    dataPoints.value = [
      ...dataPoints.value,
      {
        id: latest.id,
        values: latest.values,
        ts: latest.ts,
      },
    ]
    updateChartData()
  }
})
</script>

<style scoped></style>
