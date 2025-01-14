import { DateTime } from 'luxon'

// Convert from organization timezone to browser timezone
Date.prototype.toBrowserTimezone = function (orgTimezone: string): Date {
  // First, interpret this date as being in org's timezone
  const dateTime = DateTime.fromJSDate(this)
    .setZone(orgTimezone) // Set the input date to org timezone
    .setZone('local') // Convert to browser's local timezone

  if (!dateTime.isValid) {
    throw new Error(
      `Invalid timezone conversion from ${orgTimezone} to browser timezone`
    )
  }

  return dateTime.toJSDate()
}

// Convert from browser timezone to organization timezone
Date.prototype.toOrgTimezone = function (orgTimezone: string): Date {
  // Take the browser local time and convert it to org timezone
  const dateTime = DateTime.fromJSDate(this).setZone(orgTimezone) // Convert to organization's timezone

  if (!dateTime.isValid) {
    throw new Error(
      `Invalid timezone conversion from browser timezone to ${orgTimezone}`
    )
  }

  return dateTime.toJSDate()
}
