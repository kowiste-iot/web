declare global {
  interface Date {
    /**
     * Converts a date from browser's timezone to organization's timezone
     * @param orgTimezone Organization's IANA timezone string (e.g., 'America/New_York')
     * @returns Date object represented in organization's timezone
     */
    toBrowserTimezone(orgTimezone: string): Date

    /**
     * Converts a date from organization's timezone to browser's timezone
     * @param orgTimezone Organization's IANA timezone string (e.g., 'America/New_York')
     * @returns Date object represented in browser's timezone
     */
    toOrgTimezone(orgTimezone: string): Date

    /**
     * Formats a date in organization's timezone
     * @param format  Luxon format string
     * @returns Formatted date string
     */
    format(format: string): string
  }
}

import './date.format'
import './date.timezone'
export {}
