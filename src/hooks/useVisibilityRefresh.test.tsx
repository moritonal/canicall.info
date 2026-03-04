import { act, render } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useVisibilityRefresh } from "./useVisibilityRefresh";

function Harness({ onRefresh }: { onRefresh: () => void }) {
  const [intervalMs] = useState(1000);
  useVisibilityRefresh(onRefresh, intervalMs);
  return null;
}

describe("useVisibilityRefresh", () => {
  it("refreshes on focus and interval", () => {
    vi.useFakeTimers();
    const onRefresh = vi.fn();
    render(<Harness onRefresh={onRefresh} />);

    act(() => {
      window.dispatchEvent(new Event("focus"));
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onRefresh).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
