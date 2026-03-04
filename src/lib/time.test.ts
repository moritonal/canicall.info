import { describe, expect, it, vi } from "vitest";
import { canCallNow, formatTimezoneLabel } from "./time";

describe("time helpers", () => {
  it("formats timezone label", () => {
    expect(formatTimezoneLabel("America/Los_Angeles")).toBe("Los Angeles");
  });

  it("returns true for a valid calling hour", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T18:00:00.000Z"));
    expect(canCallNow("UTC")).toBe(true);
    vi.useRealTimers();
  });

  it("returns false at boundary hour", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T08:00:00.000Z"));
    expect(canCallNow("UTC")).toBe(false);
    vi.useRealTimers();
  });
});
