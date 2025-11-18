import { DateTime, Settings } from "luxon";

export function setTimezone(date: Date) {
  if (date === null) return null

  return DateTime
    .fromJSDate(date, { zone: 'utc' })
    .setZone(Settings.defaultZone, {
      keepLocalTime: true,
    })
}
