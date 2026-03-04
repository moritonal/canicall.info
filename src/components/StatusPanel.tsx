interface StatusPanelProps {
  cleanTimeZone: string;
  cleanTime: string;
  canCallLabel: string;
  isLocationSet: boolean;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
}

export function StatusPanel({
  cleanTimeZone,
  cleanTime,
  canCallLabel,
  isLocationSet,
  status,
  error
}: StatusPanelProps) {
  if (!isLocationSet && status !== "loading" && status !== "error") {
    return null;
  }

  return (
    <div className="outputContainer" aria-live="polite">
      {status === "loading" ? <p className="statusText">Refreshing timezone...</p> : null}
      {status === "error" ? <p className="statusText error">{error ?? "Lookup failed"}</p> : null}
      {isLocationSet ? (
        <>
          <div className="timezone">
            <span>{cleanTimeZone}</span> <span>-</span> <span>{cleanTime}</span>
          </div>
          <div className="canCall">
            <span>{canCallLabel}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
