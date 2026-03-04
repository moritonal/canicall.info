import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getHourInTimezone(timeZoneId: string): number {
  return Number.parseInt(dayjs().tz(timeZoneId).format("H"), 10);
}

export function canCallNow(timeZoneId: string): boolean {
  const hour = getHourInTimezone(timeZoneId);
  return hour > 8 && hour < 22;
}

export function formatLocalTime(timeZoneId: string): string {
  return dayjs().tz(timeZoneId).format("hh:mm A");
}

export function formatTimezoneLabel(timeZoneId: string): string {
  return timeZoneId.replace(/_/g, " ").replace(/^(.*)\//, "");
}
