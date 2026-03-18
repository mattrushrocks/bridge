"use client";

import { useEffect, useMemo, useState } from "react";

type TimerProps = {
  phaseStartedAt: number;
  countdownSeconds: number | null;
  label: string;
};

export default function Timer({ phaseStartedAt, countdownSeconds, label }: TimerProps) {
  const [now, setNow] = useState(phaseStartedAt);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, []);

  const remaining = useMemo(() => {
    if (countdownSeconds === null) return null;
    const elapsed = Math.floor((now - phaseStartedAt) / 1000);
    return Math.max(0, countdownSeconds - elapsed);
  }, [countdownSeconds, now, phaseStartedAt]);

  const urgent = remaining !== null && remaining <= 30;
  const critical = remaining !== null && remaining <= 10;
  const almostDone = remaining !== null && remaining <= 60;

  const guidance =
    label === "role countdown"
      ? "You have about 20 seconds to absorb your role and prepare one key point to share."
      : label === "share countdown"
        ? "You have about 2 minutes for this phase. Share the one thing your team cannot miss."
        : label === "decision countdown"
          ? "You have about 3 minutes for this phase. Coordinate approvals and contributions before you commit."
          : "Work together and keep the mission moving.";

  const signal =
    critical
      ? "Final moments. Lock in your plan."
      : almostDone
        ? "About 1 minute remaining. Wrap up your decisions."
        : urgent
          ? "Time is tightening. Focus on the most important tradeoffs."
          : "Stay coordinated. Your outcome depends on combined choices.";

  return (
    <div
      className={`glass-panel ambient-pulse rounded-[1.5rem] p-5 ${critical ? "pulse-critical" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">{label.replace(" countdown", " phase")}</p>
      <p className="mt-3 text-lg font-medium leading-7 text-[var(--cg-ink)]">{guidance}</p>
      <p className={`mt-4 text-sm font-medium ${urgent ? "text-[var(--cg-amber)]" : "text-[var(--cg-blue)]"}`}>{signal}</p>
    </div>
  );
}
