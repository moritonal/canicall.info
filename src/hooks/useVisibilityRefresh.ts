import { useEffect } from "react";

export function useVisibilityRefresh(onRefresh: () => void, intervalMs: number): void {
  useEffect(() => {
    const onFocus = (): void => {
      onRefresh();
    };

    const onVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        onRefresh();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const timerId = window.setInterval(() => {
      onRefresh();
    }, intervalMs);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(timerId);
    };
  }, [intervalMs, onRefresh]);
}
