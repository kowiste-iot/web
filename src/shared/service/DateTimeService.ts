import { DateTime } from 'luxon'

export class DateTimeService {
  private serverTimezone: string

  constructor(serverTimezone: string = 'Europe/Madrid') {
    this.serverTimezone = serverTimezone
  }

  setServerTimezone(timezone: string): void {
    this.serverTimezone = timezone
  }

  // Convert from backend (server timezone) to local display time
  // Preserves the displayed time regardless of user's timezone
  fromServer(isoString: string): DateTime {
    return DateTime.fromISO(isoString, { zone: this.serverTimezone })
  }

  // Convert to backend (server timezone) from local input
  // Preserves the input time regardless of user's timezone
  toServer(dateTime: DateTime): string | null {
    return dateTime.setZone(this.serverTimezone).toISO()
  }

  // Parse user input (assuming it's in server timezone)
  parseUserInput(timeString: string, referenceDate?: DateTime): DateTime {
    const reference =
      referenceDate ?? DateTime.now().setZone(this.serverTimezone)

    // If time-only input (e.g., "23:00")
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':').map(Number)
      return reference.set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0,
      })
    }

    // For full datetime input
    return DateTime.fromISO(timeString, { zone: this.serverTimezone })
  }

  // Format for display to user
  formatForDisplay(dateTime: DateTime, format: string = 'HH:mm'): string {
    return dateTime.toFormat(format)
  }
}
