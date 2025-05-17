import { ref, computed } from 'vue'
import { type DateItem, WeekDay, type DatePickerProps } from './models'

export function useDatePicker(props: DatePickerProps) {
  const currentDate = ref(new Date())
  const selectedTime = ref('00:00')
  const rangeStart = ref<Date | null>(null)
  const rangeEnd = ref<Date | null>(null)

  const weekDays = computed(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return [...days.slice(props.startWeek), ...days.slice(0, props.startWeek)]
  })

  const timeOptions = computed(() => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        times.push(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`
        )
      }
    }
    return times
  })


  const calendarDates = computed(() =>
    getCalendarDates(currentDate.value, props.startWeek!)
  )

  function getCalendarDates(date: Date, startWeek: WeekDay): DateItem[] {
    const dates: DateItem[] = []
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    let firstDayOfWeek = firstDay.getDay()
    firstDayOfWeek = (firstDayOfWeek - startWeek + 7) % 7

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay)
      date.setDate(date.getDate() - i - 1)
      dates.push(createDateItem(date, false))
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        i
      )
      dates.push(createDateItem(date, true))
    }

    // Next month days
    const remaining = 42 - dates.length
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(lastDay)
      date.setDate(date.getDate() + i)
      dates.push(createDateItem(date, false))
    }

    return dates
  }

  function createDateItem(date: Date, isCurrentMonth: boolean): DateItem {
    return {
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth,
    }
  }

  function formatDate(date: Date): string {
    return date.format(props.dateFormat!)
  }

  function isDisabled(date: Date) {
    if (props.minDate && date < props.minDate) return true
    if (props.maxDate && date > props.maxDate) return true
    return false
  }

  function isToday(date: Date) {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  function prevMonth() {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    )
  }

  function nextMonth() {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    )
  }

  return {
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
  }
}
