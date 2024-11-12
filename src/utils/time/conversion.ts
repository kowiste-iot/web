import { DateTime } from 'luxon'

/**
 * Return date as string using the passing format
 *
 * @param {Date} data date to convert.
 * @return {string}  date as string.
 */
export function timeToFormat(data: Date, format: string): string {
  if (!data || isNaN(data.getTime())) return '-'
  var luxonDate = DateTime.fromJSDate(data)
  return luxonDate.toFormat(format)
}
