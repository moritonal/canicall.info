export type LookupStatus = "idle" | "loading" | "ready" | "error";

export interface AppState {
  location: string;
  timeZoneId: string | null;
  status: LookupStatus;
  error: string | null;
  awesome: boolean;
}

export interface TimezoneLookupResult {
  timeZoneId: string;
  normalizedLocation: string;
}

export interface CachedTimezoneEntry {
  timeZoneId: string;
  savedAt: number;
}
