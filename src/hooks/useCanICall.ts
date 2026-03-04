import { useCallback, useMemo, useRef, useState } from "react";
import { getCachedTimezone, setCachedTimezone } from "../lib/cache";
import { formatLocalTime, formatTimezoneLabel, canCallNow } from "../lib/time";
import { getStoredLocation, setStoredLocation } from "../lib/storage";
import { resolveLocationToTimezone, getAliasTimezone } from "../services/locationResolver";
import type { AppState } from "../types";

const INITIAL_LOCATION = getStoredLocation();

function initialState(): AppState {
  const aliasTimezone = INITIAL_LOCATION ? getAliasTimezone(INITIAL_LOCATION) : null;
  const cachedTimezone = INITIAL_LOCATION ? getCachedTimezone(INITIAL_LOCATION) : null;
  const timeZoneId = aliasTimezone ?? cachedTimezone;

  return {
    location: INITIAL_LOCATION,
    timeZoneId,
    status: timeZoneId ? "ready" : "idle",
    error: null,
    awesome: INITIAL_LOCATION.toLowerCase().includes("tish") || INITIAL_LOCATION.toLowerCase().includes("tom")
  };
}

export function useCanICall() {
  const [state, setState] = useState<AppState>(() => initialState());
  const inFlightRef = useRef<Map<string, Promise<void>>>(new Map());

  const lookupTimezone = useCallback(async (locationInput: string): Promise<void> => {
    const location = locationInput.trim();

    if (!location) {
      setState((previous) => ({
        ...previous,
        location: "",
        timeZoneId: null,
        status: "idle",
        error: null,
        awesome: false
      }));
      setStoredLocation("");
      return;
    }

    const cached = getCachedTimezone(location);
    const isAwesome = location.toLowerCase().includes("tish") || location.toLowerCase().includes("tom");

    if (cached) {
      setState((previous) => ({
        ...previous,
        location,
        timeZoneId: cached,
        status: "ready",
        error: null,
        awesome: isAwesome
      }));
      setStoredLocation(location);
      return;
    }

    const key = location.toLowerCase();

    if (inFlightRef.current.has(key)) {
      await inFlightRef.current.get(key);
      return;
    }

    const request = (async () => {
      try {
        const result = await resolveLocationToTimezone(location);
        setCachedTimezone(result.normalizedLocation, result.timeZoneId);
        setStoredLocation(result.normalizedLocation);

        setState((previous) => ({
          ...previous,
          location: result.normalizedLocation,
          timeZoneId: result.timeZoneId,
          status: "ready",
          error: null,
          awesome: isAwesome
        }));
      } catch (error) {
        setState((previous) => ({
          ...previous,
          status: previous.timeZoneId ? "ready" : "idle",
          error: null
        }));
      }
    })();

    inFlightRef.current.set(key, request);

    try {
      await request;
    } finally {
      inFlightRef.current.delete(key);
    }
  }, []);

  const setLocation = useCallback((location: string) => {
    setState((previous) => ({ ...previous, location }));
  }, []);

  const derived = useMemo(() => {
    const hasLocation = Boolean(state.location);
    const isLocationSet = hasLocation && Boolean(state.timeZoneId);

    if (!state.timeZoneId) {
      return {
        isLocationSet,
        cleanTime: "",
        cleanTimeZone: "",
        canCallLabel: "",
        isGreen: false,
        isRed: false
      };
    }

    const callAllowed = canCallNow(state.timeZoneId);
    const prefix = state.awesome ? "Love you, and " : "";

    return {
      isLocationSet,
      cleanTime: formatLocalTime(state.timeZoneId),
      cleanTimeZone: formatTimezoneLabel(state.timeZoneId),
      canCallLabel: `${prefix}${callAllowed ? "Yes" : "No"}`,
      isGreen: callAllowed,
      isRed: !callAllowed
    };
  }, [state.awesome, state.location, state.timeZoneId]);

  return {
    state,
    setLocation,
    lookupTimezone,
    ...derived
  };
}
