import type { Phase } from "@/server/roomTypes";

const stages: Phase[] = ["lobby", "role", "info", "share", "decision", "outcome", "reflection"];

export default function ProgressHeader({ currentPhase }: { currentPhase: Phase }) {
  const activeIndex = stages.indexOf(currentPhase);
  const missionSteps = ["role", "info", "share", "decision", "outcome", "reflection"];
  const missionIndex = missionSteps.indexOf(currentPhase);

  return (
    <div className="glass-panel w-full overflow-x-auto rounded-[1.5rem] p-4">
      <div className="mb-3 text-sm font-medium text-[var(--cg-muted)]">
        {missionIndex >= 0 ? `Step ${missionIndex + 1} of 6` : "Lobby"}
      </div>
      <div className="grid min-w-[720px] grid-cols-6 items-end gap-3">
        {stages.map((stage, index) => {
          const active = stage === currentPhase;
          return (
            <div key={stage} className="relative">
              <div
                className={`rounded-xl border-b px-3 py-3 text-center text-sm font-semibold capitalize transition ${
                  active
                    ? "border-[var(--cg-blue)] bg-[rgba(120,167,255,0.12)] text-[var(--cg-ink)]"
                    : "border-transparent bg-[rgba(15,23,38,0.78)] text-[var(--cg-muted)]"
                }`}
              >
                {stage}
              </div>
              {index < stages.length - 1 ? (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-[rgba(120,167,255,0.18)] md:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
