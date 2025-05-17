<template>
  <div class="date-picker">
    <div class="input-wrapper" @click="handleInputClick">
      <input
        :value="formatDisplayDate"
        readonly
        placeholder="Select date"
        class="date-input"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="calendar"
        ref="calendarRef"
        :style="calendarPosition"
      >
        <div id="calendar-header" class="calendar-header">
          <button @click="navigatePrev">&lt;</button>
          <span @click="toggleView">{{ headerTitle }}</span>
          <button @click="navigateNext">&gt;</button>
        </div>

        <div v-if="currentView === 'days'" class="calendar-days">
          <div v-for="day in weekDays" :key="day" class="week-day">
            {{ day }}
          </div>
          <div
            v-for="(date, id) in calendarDates"
            :key="id"
            class="calendar-date"
            :class="getDateClasses(date)"
            @click="selectDate(date)"
          >
            {{ date.dayOfMonth }}

            <div v-if="showTime && isSelected(date.date)" class="time-selector">
              <select v-model="selectedTime" @change="updateDateTime">
                <option v-for="time in timeOptions" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-else-if="currentView === 'months'" class="calendar-months">
          <div
            v-for="(month, index) in months"
            :key="month"
            class="month-item"
            :class="{ selected: index === currentDate.getMonth() }"
            @click="selectMonth(index)"
          >
            {{ month }}
          </div>
        </div>

        <div v-else class="calendar-years">
          <div
            v-for="year in yearRange"
            :key="year"
            class="year-item"
            :class="{ selected: year === currentDate.getFullYear() }"
            @click="selectYear(year)"
          >
            {{ year }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  WeekDay,
  type DateItem,
  type DateRange,
  type DatePickerProps,
} from './models'
import { useDatePicker } from './useDatePicker'

const modelValue = defineModel<Date | DateRange>()
const props = withDefaults(defineProps<DatePickerProps>(), {
  selectionColor: '#4CAF50',
  showTime: false,
  rangeSelection: false,
  startWeek: WeekDay.Monday,
  dateFormat: 'dd/MM/yyyy',
})

const currentView = ref<'days' | 'months' | 'years'>('days')
const decades = ref(Math.floor(new Date().getFullYear() / 10) * 10)

const {
  currentDate,
  selectedTime,
  rangeStart,
  rangeEnd,
  weekDays,
  timeOptions,
  calendarDates,
  formatDate,
  isDisabled,
  isToday,
  prevMonth,
  nextMonth,
} = useDatePicker(props)

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const yearRange = computed(() => {
  const startYear = decades.value
  return Array.from({ length: 12 }, (_, i) => startYear + i)
})

const headerTitle = computed(() => {
  switch (currentView.value) {
    case 'days':
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(currentDate.value)
    case 'months':
      return currentDate.value.getFullYear().toString()
    case 'years':
      return `${decades.value} - ${decades.value + 11}`
  }
})

function toggleView() {
  switch (currentView.value) {
    case 'days':
      currentView.value = 'months'
      break
    case 'months':
      currentView.value = 'years'
      break
  }
}

function navigatePrev() {
  switch (currentView.value) {
    case 'days':
      prevMonth()
      break
    case 'months':
      currentDate.value.setFullYear(currentDate.value.getFullYear() - 1)
      break
    case 'years':
      decades.value -= 10
      break
  }
}

function navigateNext() {
  switch (currentView.value) {
    case 'days':
      nextMonth()
      break
    case 'months':
      currentDate.value.setFullYear(currentDate.value.getFullYear() + 1)
      break
    case 'years':
      decades.value += 10
      break
  }
}

function selectMonth(monthIndex: number) {
  currentDate.value.setMonth(monthIndex)
  currentView.value = 'days'
}

function selectYear(year: number) {
  currentDate.value.setFullYear(year)
  currentView.value = 'months'
}

const isOpen = ref(false)
const calendarRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLElement | null>(null)
const calendarPosition = ref({ top: '0px', left: '0px' })

const formatDisplayDate = computed(() => {
  if (!modelValue.value) return ''

  if (props.rangeSelection) {
    const value = modelValue.value as DateRange
    if (!value.start || !value.end) return ''
    return `${formatDate(value.start)} - ${formatDate(value.end)}`
  }

  return formatDate(modelValue.value as Date)
})

function getDateClasses(date: DateItem) {
  return {
    disabled: isDisabled(date.date),
    selected: isSelected(date.date),
    start: isRangeStart(date.date),
    end: isRangeEnd(date.date),
    'in-range': isInRange(date.date),
    today: isToday(date.date),
    'other-month': !date.isCurrentMonth,
  }
}

function isSelected(date: Date) {
  if (!modelValue.value) return false

  if (props.rangeSelection) {
    const value = modelValue.value as DateRange
    return (
      value.start?.getTime() === date.getTime() ||
      value.end?.getTime() === date.getTime()
    )
  }

  const value = modelValue.value as Date
  return value.getTime() === date.getTime()
}

function isRangeStart(date: Date) {
  if (!props.rangeSelection || !modelValue.value) return false
  const value = modelValue.value as DateRange
  return value.start?.getTime() === date.getTime()
}

function isRangeEnd(date: Date) {
  if (!props.rangeSelection || !modelValue.value) return false
  const value = modelValue.value as DateRange
  return value.end?.getTime() === date.getTime()
}

function isInRange(date: Date) {
  if (!props.rangeSelection || !modelValue.value) return false

  const value = modelValue.value as DateRange
  if (!value.start || !value.end) return false

  return date > value.start && date < value.end
}

function updateCalendarPosition() {
  const input = inputRef.value?.getBoundingClientRect()
  if (!input) return

  calendarPosition.value = {
    top: `${input.bottom + window.scrollY + 4}px`,
    left: `${input.left + window.scrollX}px`,
  }
}

function handleInputClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  inputRef.value = target
  updateCalendarPosition()
  isOpen.value = true
  event.stopPropagation()
}

function handleClickOutside(event: MouseEvent) {
  if (calendarRef.value && !calendarRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function selectDate(dateItem: DateItem) {
  if (isDisabled(dateItem.date)) return

  if (props.rangeSelection) {
    if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
      rangeStart.value = dateItem.date
      rangeEnd.value = null
    } else {
      if (dateItem.date < rangeStart.value) {
        rangeEnd.value = rangeStart.value
        rangeStart.value = dateItem.date
      } else {
        rangeEnd.value = dateItem.date
      }
    }

    modelValue.value = {
      start: rangeStart.value,
      end: rangeEnd.value,
    } as DateRange
  } else {
    const date = new Date(dateItem.date)
    if (props.showTime) {
      const [hours, minutes] = selectedTime.value.split(':')
      date.setHours(parseInt(hours))
      date.setMinutes(parseInt(minutes))
    }
    modelValue.value = date
    if (!props.showTime) {
      isOpen.value = false
    }
  }
}

function updateDateTime() {
  if (
    !props.showTime ||
    !modelValue.value ||
    !(modelValue.value instanceof Date)
  )
    return

  const date = new Date(modelValue.value)
  const [hours, minutes] = selectedTime.value.split(':')
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  modelValue.value = date
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', updateCalendarPosition)
  window.addEventListener('resize', updateCalendarPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateCalendarPosition)
  window.removeEventListener('resize', updateCalendarPosition)
})

const root = document.documentElement
watch(
  () => props.selectionColor,
  (newColor) => {
    root.style.setProperty('--selection-color-alpha', `${newColor}40`)
  },
  { immediate: true }
)
</script>

<style scoped>
.date-picker {
  position: relative;
  width: 300px;
}

.date-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.calendar {
  position: fixed;
  z-index: 1000;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.calendar-header button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px 10px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  padding: 8px;
}

.week-day {
  padding: 8px 0;
  text-align: center;
  font-weight: bold;
  font-size: 0.9em;
  color: #666;
}

.calendar-date {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  margin: 2px;
  position: relative;
  font-size: 0.9em;
}

.calendar-date:hover {
  background-color: #f0f0f0;
}

.calendar-date.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.calendar-date.other-month {
  color: #999;
}

.calendar-date.selected {
  background-color: v-bind(selectionColor);
  color: white;
}

.calendar-date.start {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.calendar-date.end {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.calendar-date.in-range {
  background-color: var(--selection-color-alpha);
  border-radius: 0;
}

.calendar-date.today {
  font-weight: bold;
  border: 1px solid #666;
}

.time-selector {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

.time-selector select {
  width: 100px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.calendar-months,
.calendar-years {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
}

.month-item,
.year-item {
  padding: 12px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}

.month-item:hover,
.year-item:hover {
  background-color: #f0f0f0;
}

.month-item.selected,
.year-item.selected {
  background-color: v-bind(selectionColor);
  color: white;
}
</style>
