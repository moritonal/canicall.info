import { useEffect, useRef } from "react";
import { FooterCredits } from "./components/FooterCredits";
import { LocationInput } from "./components/LocationInput";
import { StatusPanel } from "./components/StatusPanel";
import { useCanICall } from "./hooks/useCanICall";
import { useVisibilityRefresh } from "./hooks/useVisibilityRefresh";

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const DEBOUNCE_DELAY_MS = 500;

export default function App() {
  const { state, setLocation, lookupTimezone, isLocationSet, cleanTime, cleanTimeZone, canCallLabel, isGreen, isRed } = useCanICall();
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      void lookupTimezone(state.location);
    }, DEBOUNCE_DELAY_MS);

    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [lookupTimezone, state.location]);

  useVisibilityRefresh(() => {
    void lookupTimezone(state.location);
  }, REFRESH_INTERVAL_MS);

  const backgroundClassName = [
    "background",
    isRed ? "redBackground" : "",
    isGreen ? "greenBackground" : "",
    isLocationSet && !isRed && !isGreen ? "blankBackground" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div id="background" className={backgroundClassName}>
      <div className="container">
        <StatusPanel
          cleanTime={cleanTime}
          cleanTimeZone={cleanTimeZone}
          canCallLabel={canCallLabel}
          isLocationSet={isLocationSet}
          status={state.status}
          error={state.error}
        />

        <LocationInput value={state.location} isSubbed={isLocationSet} onChange={setLocation} />

        <FooterCredits />
      </div>
    </div>
  );
}
