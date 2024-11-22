<template>
  <div class="color-picker-container">
    <!-- Color preview box -->
    <div
      class="color-box"
      :style="{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
      }"
      @click.stop="showPicker = !showPicker"
    ></div>

    <!-- Color picker card -->
    <Transition name="fade">
      <div v-if="showPicker" ref="pickerRef" class="picker-card" @click.stop>
        <div class="picker-content">
          <!-- Color wheel -->
          <canvas
            ref="wheelCanvas"
            class="color-wheel"
            @mousedown="handleWheelMouseDown"
          ></canvas>

          <!-- Brightness slider -->
          <canvas
            ref="brightnessCanvas"
            class="brightness-slider"
            @mousedown="handleBrightnessMouseDown"
          ></canvas>
        </div>

        <!-- Hex input -->
        <input
          type="text"
          v-model="hexInput"
          class="hex-input"
          @input="updateFromHexInput"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

interface ColorPickerProps {
  size?: number
}

const color = defineModel<string>({ default: '#ff0000' })
const props = withDefaults(defineProps<ColorPickerProps>(), {
  size: 40,
})

const showPicker = ref(false)
const wheelCanvas = ref<HTMLCanvasElement | null>(null)
const brightnessCanvas = ref<HTMLCanvasElement | null>(null)
const hexInput = ref(color.value)
const pickerRef = ref<HTMLDivElement | null>(null)

let isDraggingWheel = false
let isDraggingBrightness = false
const hue = ref(0)
const saturation = ref(100)
const brightness = ref(100)

// Watch for picker visibility and redraw canvases
watch(showPicker, (newValue) => {
  if (newValue) {
    nextTick(() => {
      drawColorWheel()
      drawBrightnessSlider()
    })
  }
})

// Handle wheel click and drag
const handleWheelMouseDown = (event: MouseEvent) => {
  isDraggingWheel = true
  handleWheelMove(event)
}

const handleWheelMove = (event: MouseEvent) => {
  const canvas = wheelCanvas.value
  if (!canvas || !isDraggingWheel) return

  const rect = canvas.getBoundingClientRect()
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  const x = event.clientX - rect.left - centerX
  const y = event.clientY - rect.top - centerY

  const angle = (Math.atan2(y, x) * 180) / Math.PI
  hue.value = (angle + 360) % 360

  const distance = Math.sqrt(x * x + y * y)
  const maxDistance = canvas.width / 2 - 2
  saturation.value = Math.min(100, Math.max(0, (distance / maxDistance) * 100))

  updateColor()
}

// Handle brightness click and drag
const handleBrightnessMouseDown = (event: MouseEvent) => {
  isDraggingBrightness = true
  handleBrightnessMove(event)
}

const handleBrightnessMove = (event: MouseEvent) => {
  const canvas = brightnessCanvas.value
  if (!canvas || !isDraggingBrightness) return

  const rect = canvas.getBoundingClientRect()
  const y = event.clientY - rect.top

  brightness.value = 100 - (y / canvas.height) * 100
  brightness.value = Math.min(100, Math.max(0, brightness.value))

  updateColor()
}

// Draw color wheel
const drawColorWheel = () => {
  const canvas = wheelCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 200
  canvas.height = 200

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = canvas.width / 2 - 2

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let angle = 0; angle < 360; angle++) {
    const startAngle = ((angle - 2) * Math.PI) / 180
    const endAngle = ((angle + 2) * Math.PI) / 180

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    )
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`)

    ctx.fillStyle = gradient
    ctx.fill()
  }
}

// Draw brightness slider
const drawBrightnessSlider = () => {
  const canvas = brightnessCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 30
  canvas.height = 200

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, `hsl(${hue.value}, ${saturation.value}%, 100%)`)
  gradient.addColorStop(1, 'black')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// Convert HSV to Hex
const hsvToHex = (h: number, s: number, v: number): string => {
  s /= 100
  v /= 100

  const hi = Math.floor(h / 60) % 6
  const f = h / 60 - Math.floor(h / 60)
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  let r = 0,
    g = 0,
    b = 0

  switch (hi) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  const toHex = (n: number): string => {
    return Math.round(n * 255)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Update color value
const updateColor = () => {
  const newColor = hsvToHex(hue.value, saturation.value, brightness.value)
  hexInput.value = newColor
  color.value = newColor
  drawBrightnessSlider()
}

// Handle hex input
const updateFromHexInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value
  if (/^#[0-9A-Fa-f]{6}$/.test(input)) {
    color.value = input
  }
}

// Handle mouse up
const handleMouseUp = () => {
  isDraggingWheel = false
  isDraggingBrightness = false
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    showPicker.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    if (showPicker.value) {
      drawColorWheel()
      drawBrightnessSlider()
    }
  })
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mousemove', handleWheelMove)
  document.addEventListener('mousemove', handleBrightnessMove)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mousemove', handleWheelMove)
  document.removeEventListener('mousemove', handleBrightnessMove)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.color-picker-container {
  display: inline-block;
  position: relative;
}

.color-box {
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.color-box:hover {
  border-color: #999;
}

.picker-card {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.picker-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.color-wheel {
  width: 200px;
  height: 200px;
  cursor: crosshair;
}

.brightness-slider {
  width: 30px;
  height: 200px;
  cursor: ns-resize;
}

.hex-input {
  width: calc(100% - 1rem);
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  text-align: center;
  margin: 0 0.5rem;
}

.hex-input:focus {
  outline: none;
  border-color: #666;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
