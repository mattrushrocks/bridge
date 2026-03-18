import { CrisisEvent } from "@/lib/gameTypes";

export default function CrisisEventCard({ event }: { event: CrisisEvent | null }) {
  if (!event) {
    return (
      <div className="glass-panel rounded-[1.5rem] px-5 py-6 text-sm text-[var(--cg-muted)]">
        Crisis monitor standing by.
      </div>
    );
  }

  return (
    <article className="glass-panel rounded-[1.5rem] border-[rgba(204,107,104,0.28)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-red)]">Crisis Event</p>
      <h3 className="mt-3 text-2xl font-semibold text-[var(--cg-ink)]">{event.name}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--cg-muted)]">{event.description}</p>
    </article>
  );
}
