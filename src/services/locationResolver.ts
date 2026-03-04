import type { TimezoneLookupResult } from "../types";
import { getCoordinates } from "./googleGeocode";
import { getTimezoneId } from "./googleTimezone";

export function getAliasTimezone(location: string): string | null {
  const normalized = location.toLowerCase();

  if (normalized.includes("tish")) {
    return import.meta.env.VITE_TISH_TIMEZONE || "America/Los_Angeles";
  }

  if (normalized.includes("tom")) {
    return "Europe/London";
  }

  return null;
}

export async function resolveLocationToTimezone(location: string): Promise<TimezoneLookupResult> {
  const aliasTimeZone = getAliasTimezone(location);
  if (aliasTimeZone) {
    return {
      timeZoneId: aliasTimeZone,
      normalizedLocation: location
    };
  }

  const coords = await getCoordinates(location);
  const timeZoneId = await getTimezoneId(coords.lat, coords.lng);

  return {
    timeZoneId,
    normalizedLocation: location
  };
}
