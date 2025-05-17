import { DateTime } from 'luxon'

// Format date in organization timezone
Date.prototype.format = function (
  format: string
): string {
  const dateTime = DateTime.fromJSDate(this)

  if (!dateTime.isValid) {
    throw new Error(`Invalid date`)
  }

  if (format) {
    return dateTime.toFormat(format)
  }

  const isoString = dateTime.toISO()
  if (!isoString) {
    throw new Error('Failed to format date')
  }

  return isoString
}
