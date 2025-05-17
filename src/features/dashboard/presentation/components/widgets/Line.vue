<template>
  <WidgetCard :data="data" :measureCondition="calculateMeasureCondition">
    <Line class="full-height" :options="chartOptions" :data="chartData" />
  </WidgetCard>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-luxon' // Add this import

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
import { DateTime } from 'luxon'
import type { IWidgetData } from '@/features/dashboard/domain/widget'
import type { IDataModel } from '@/features/shared/domain/data'
import WidgetCard from '../WidgetCard.vue'

interface Props {
  data: IWidgetData
  duration?: number
  horizontalLabels?: boolean
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
const dataPoints = shallowRef<IDataModel[]>([])

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

const chartOptions = computed(() => ({
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
        maxRotation: 0,
        minRotation: 0,
        autoSkip: true,
        maxTicksLimit: 6,
        padding: 0,
      },
    },
  },
  plugins: {
    legend: {
      display: options.value.showLegend,
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        title: (context: any) => formatFullDateTime(context[0].raw.x),
      },
    },
  },
}))

const chartData = shallowRef({
  datasets: [
    {
      label: props.data.link[0]?.legend,
      data: [] as { x: number; y: number }[],
      borderColor: options.value.color,
      backgroundColor: options.value.color + '33',
      borderWidth: 2,
      fill: options.value.fill,
      tension: 0.1,
    },
  ],
})

const lastValue = computed(() => modelValue.value[modelValue.value.length - 1])

const calculateMeasureCondition = computed(() => {
  const { max, min } = options.value
  const value = lastValue.value?.values?.temperature

  if (value === undefined) return false

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
        label: props.data.link[0]?.legend,
        data: filteredData.map((point) => ({
          x: point.ts.getTime(),
          y: point.values[props.data.link[0]?.tag],
        })),
        borderColor: options.value.color,
        backgroundColor: options.value.color + '33',
        borderWidth: 2,
        fill: options.value.fill,
        tension: 0.1,
      },
    ],
  }
}

watch(() => props.duration, updateChartData)

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

watch(
  [options, props.data],
  () => {
    updateChartData()
  },
  { deep: true }
)

onMounted(() => {
  const now = DateTime.now()
  dataPoints.value = [
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
  updateChartData()
})
</script>

<style scoped></style>
