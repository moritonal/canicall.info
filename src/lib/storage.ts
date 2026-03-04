const LOCATION_KEY = "canicall:v2:location";
const CACHE_KEY = "canicall:v2:timezoneCache";

export function getStoredLocation(): string {
  return window.localStorage.getItem(LOCATION_KEY) ?? "";
}

export function setStoredLocation(value: string): void {
  if (!value) {
    window.localStorage.removeItem(LOCATION_KEY);
    return;
  }

  window.localStorage.setItem(LOCATION_KEY, value);
}

export function getStoredCache(): string {
  return window.localStorage.getItem(CACHE_KEY) ?? "{}";
}

export function setStoredCache(value: string): void {
  window.localStorage.setItem(CACHE_KEY, value);
}
