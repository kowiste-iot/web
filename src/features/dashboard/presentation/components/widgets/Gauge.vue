<template>
  <WidgetCard :data="data" :measureCondition="true">
    {{ data }}
    <div class="w-full">
      <svg
        class="inset-0 w-full h-full"
        :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
        :style="{
          border: options.borderWidth
            ? `${options.borderWidth}px solid ${options.borderColor}`
            : 'none',
        }"
      >
        <!-- Colored zones -->
        <path
          :d="goodPath"
          class="transition-all duration-300"
          fill="#22c55e"
        />
        <path
          :d="warningPath"
          class="transition-all duration-300"
          fill="#f59e0b"
        />
        <path
          :d="dangerPath"
          class="transition-all duration-300"
          fill="#ef4444"
        />

        <!-- Triangular Needle -->
        <path
          :d="needlePath"
          fill="#1f2937"
          class="transition-all duration-300 origin-center"
        />

        <!-- Value circle with dynamic background -->
        <circle
          :cx="center"
          :cy="center"
          :r="valueCircleRadius"
          :fill="currentZoneColor"
          class="transition-all duration-300"
        />

        <!-- Border circle -->
        <circle
          :cx="center"
          :cy="center"
          :r="valueCircleRadius"
          fill="none"
          :stroke="'#1f2937'"
          :stroke-width="data.options.thickness / 2"
        />

        <!-- Value text -->
        <text
          :x="center"
          :y="center"
          text-anchor="middle"
          dominant-baseline="middle"
          :font-size="viewBoxSize / 8"
          font-weight="bold"
          :fill="textColor"
          class="transition-all duration-300"
        >
          {{ modelValue }}
        </text>
      </svg>
    </div>
  </WidgetCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IWidgetData } from '@/features/dashboard/domain/widget';
import WidgetCard from '../WidgetCard.vue';
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

// Calculate the viewBox size and center point
const viewBoxSize = 200
const center = viewBoxSize / 2
const radius = (viewBoxSize * 0.8) / 2
const valueCircleRadius = radius * 0.3 // Size of the central circle

// Helper function to convert polar coordinates to cartesian
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

// Calculate total angle span
const angleSpan = computed(() => {
  let span = options.value.endAngle - options.value.startAngle
  if (span <= 0) span += 360
  return span
})

// Convert value to percentage of the arc
const valuePercentage = computed(() => {
  const range = options.value.max - options.value.min
  return ((modelValue.value - options.value.min) / range) * 100
})

// Calculate current angle based on value
const currentAngle = computed(() => {
  const angle =
    options.value.startAngle + (angleSpan.value * valuePercentage.value) / 100
  return angle >= 360 ? angle - 360 : angle
})

// Determine current zone color based on value
const currentZoneColor = computed(() => {
  if (modelValue.value <= options.value.goodLimit) return '#22c55e' // Green
  if (modelValue.value <= options.value.warningLimit) return '#f59e0b' // Yellow
  return '#ef4444' // Red
})

// Determine text color based on background
const textColor = computed(() => {
  // Use white text for all backgrounds to ensure readability
  return '#ffffff'
})

// Generate line-ended arc path
const generateArc = (
  startAngleVal: number,
  endAngleVal: number,
  innerRadius: number,
  outerRadius: number
) => {
  const innerStart = polarToCartesian(
    center,
    center,
    innerRadius,
    startAngleVal
  )
  const innerEnd = polarToCartesian(center, center, innerRadius, endAngleVal)
  const outerStart = polarToCartesian(
    center,
    center,
    outerRadius,
    startAngleVal
  )
  const outerEnd = polarToCartesian(center, center, outerRadius, endAngleVal)

  const largeArcFlag = endAngleVal - startAngleVal <= 180 ? 0 : 1

  return [
    'M',
    outerStart.x,
    outerStart.y,
    'A',
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    1,
    outerEnd.x,
    outerEnd.y,
    'L',
    innerEnd.x,
    innerEnd.y,
    'A',
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    0,
    innerStart.x,
    innerStart.y,
    'Z',
  ].join(' ')
}

// Calculate angles for zones
const goodEndAngle = computed(() => {
  const span = (options.value.goodLimit / options.value.max) * angleSpan.value
  return (options.value.startAngle + span) % 360
})

const warningEndAngle = computed(() => {
  const span = (options.value.warningLimit / options.value.max) * angleSpan.value
  return (options.value.startAngle + span) % 360
})

// Path computations for zones
const goodPath = computed(() =>
  generateArc(
    options.value.startAngle,
    goodEndAngle.value,
    radius - options.value.thickness,
    radius
  )
)

const warningPath = computed(() =>
  generateArc(
    goodEndAngle.value,
    warningEndAngle.value,
    radius - options.value.thickness,
    radius
  )
)

const dangerPath = computed(() =>
  generateArc(
    warningEndAngle.value,
    options.value.endAngle,
    radius - options.value.thickness,
    radius
  )
)

// Calculate triangular needle path
const needlePath = computed(() => {
  const needleLength = radius - options.value.thickness / 2
  const needleWidth = options.value.thickness * 0.7 // Width of triangle base

  const tip = polarToCartesian(center, center, needleLength, currentAngle.value)
  const baseAngle = currentAngle.value + 180
  const base1 = polarToCartesian(
    center,
    center,
    needleWidth / 2,
    baseAngle + 90
  )
  const base2 = polarToCartesian(
    center,
    center,
    needleWidth / 2,
    baseAngle - 90
  )

  return `M ${tip.x} ${tip.y} L ${base1.x} ${base1.y} L ${base2.x} ${base2.y} Z`
})
</script>
