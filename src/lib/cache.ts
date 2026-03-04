import type { CachedTimezoneEntry } from "../types";
import { getStoredCache, setStoredCache } from "./storage";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function normalizeLocationKey(location: string): string {
  return location.trim().toLowerCase();
}

function readCacheMap(): Record<string, CachedTimezoneEntry> {
  try {
    const parsed = JSON.parse(getStoredCache()) as Record<string, CachedTimezoneEntry>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function getCachedTimezone(location: string): string | null {
  const key = normalizeLocationKey(location);
  const cacheMap = readCacheMap();
  const entry = cacheMap[key];

  if (!entry) {
    return null;
  }

  const age = Date.now() - entry.savedAt;
  if (age > CACHE_TTL_MS) {
    delete cacheMap[key];
    setStoredCache(JSON.stringify(cacheMap));
    return null;
  }

  return entry.timeZoneId;
}

export function setCachedTimezone(location: string, timeZoneId: string): void {
  const key = normalizeLocationKey(location);
  const cacheMap = readCacheMap();
  cacheMap[key] = {
    timeZoneId,
    savedAt: Date.now()
  };

  setStoredCache(JSON.stringify(cacheMap));
}
