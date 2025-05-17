// Enums
enum WeekDay {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

// Interfaces
interface DateItem {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
}

interface DateRange {
  start: Date | null
  end: Date | null
}

interface CalendarPosition {
  top: string
  left: string
}

interface DatePickerProps {
  modelValue?: Date | DateRange
  minDate?: Date
  maxDate?: Date
  selectionColor?: string
  showTime?: boolean
  rangeSelection?: boolean
  startWeek?: WeekDay
  dateFormat?:string
}

// DatePicker functionality
interface DatePickerState {
  currentDate: Date
  selectedTime: string
  isOpen: boolean
  calendarPosition: CalendarPosition
}

interface DatePickerMethods {
  handleInputClick(event: MouseEvent): void
  handleClickOutside(event: MouseEvent): void
  updateCalendarPosition(): void
  selectDate(dateItem: DateItem): void
  updateDateTime(): void
  prevMonth(): void
  nextMonth(): void
  formatDate(date: Date): string
  isDisabled(date: Date): boolean
  isSelected(date: Date): boolean
  isToday(date: Date): boolean
  isInRange(date: Date): boolean
  isRangeStart(date: Date): boolean
  isRangeEnd(date: Date): boolean
}

// Export types
export type {
  DateItem,
  DateRange,
  CalendarPosition,
  DatePickerProps,
  DatePickerState,
  DatePickerMethods,
}

export { WeekDay }
