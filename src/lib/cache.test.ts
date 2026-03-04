import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCachedTimezone, setCachedTimezone } from "./cache";

const CACHE_KEY = "canicall:v2:timezoneCache";

describe("timezone cache", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns a cached timezone when fresh", () => {
    setCachedTimezone("London", "Europe/London");
    expect(getCachedTimezone("london")).toBe("Europe/London");
  });

  it("expires stale entries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T00:00:00.000Z"));
    setCachedTimezone("Tokyo", "Asia/Tokyo");

    vi.setSystemTime(new Date("2026-03-06T00:00:01.000Z"));
    expect(getCachedTimezone("tokyo")).toBeNull();

    const raw = window.localStorage.getItem(CACHE_KEY);
    expect(raw).toContain("{}");
    vi.useRealTimers();
  });
});
