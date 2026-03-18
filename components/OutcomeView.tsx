import { policies } from "@/lib/gameData";
import type { OutcomeMetrics } from "@/lib/gameTypes";
import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function OutcomeView({
  room,
  currentPlayer,
  onAdvance,
  onToggleReady,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onAdvance: () => void;
  onToggleReady: () => void;
}) {
  if (!room.outcome) {
    return (
      <section className="glass-panel-strong rounded-[1.75rem] p-6">
        <h1 className="text-4xl font-semibold text-[var(--cg-ink)]">Computing outcome...</h1>
      </section>
    );
  }

  const selected = policies.find((policy) => (room.lockedPlan ?? []).includes(policy.id));
  const isReady = Boolean(currentPlayer && room.readyPlayers.includes(currentPlayer.id));
  const feedback = buildImpactFeedback(room.outcome.metrics, selected?.name, room.activeCrisisEvent?.name);

  return (
    <section className="glass-panel-strong rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Outcome</p>
      <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">What improved? What got worse?</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">{room.outcome.summary}</p>

      {selected ? (
        <div className="mt-6 rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)] p-5">
          <p className="text-sm font-medium text-[var(--cg-blue)]">Group decision</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--cg-ink)]">{selected.name}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--cg-muted)]">{selected.description}</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-green)]">What improved</p>
          <p className="mt-3 text-base leading-7 text-[var(--cg-ink)]">{feedback.improved}</p>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-amber)]">What got worse</p>
          <p className="mt-3 text-base leading-7 text-[var(--cg-ink)]">{feedback.worsened}</p>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-blue)]">Your impact</p>
          <p className="mt-3 text-base leading-7 text-[var(--cg-ink)]">{feedback.impact}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-green)]">
          +1 Collaboration
        </div>
        <div className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-blue)]">
          You balanced: {summarizeBalance(room.outcome.metrics)}
        </div>
        <div className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-muted)]">
          {room.readyPlayers.length} of {room.players.length} players ready
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleReady}
        className={`${isReady ? "cg-btn-secondary" : "cg-btn-primary"} mt-6 rounded-full px-6 py-3 text-sm`}
      >
        {isReady ? "Edit my response" : "I am ready"}
      </button>

      <button
        type="button"
        disabled={!currentPlayer?.isHost || room.readyPlayers.length !== room.players.length}
        onClick={onAdvance}
        className="cg-btn-primary mt-3 rounded-full px-6 py-3 text-sm"
      >
        {currentPlayer?.isHost ? "Host will advance when everyone is ready" : "Waiting for host"}
      </button>
    </section>
  );
}

function summarizeBalance(metrics: OutcomeMetrics) {
  if (metrics.affordability >= metrics.housingSupply && metrics.communityApproval >= 50) {
    return "affordability + stability";
  }
  if (metrics.housingSupply >= metrics.affordability) {
    return "future supply + long-term change";
  }
  return "trust + caution";
}

function buildImpactFeedback(
  metrics: OutcomeMetrics,
  selectedPolicyName?: string,
  eventName?: string,
) {
  const improved =
    metrics.housingSupply >= 58
      ? "Your group increased the chance of more homes being added to the city."
      : metrics.affordability >= 55
        ? "Your group gave current residents more protection from rising housing pressure."
        : "Your group reduced immediate disruption and created a little more breathing room.";

  const worsened =
    metrics.communityApproval < 50
      ? "Public trust became harder to hold together, so the plan may face resistance."
      : metrics.affordability < 45
        ? "Housing costs are still likely to keep straining residents in the near term."
        : "The crisis is still active, so one decision did not remove every tradeoff.";

  const impactSource = selectedPolicyName ? `By choosing ${selectedPolicyName}` : "By making a shared decision";
  const eventContext = eventName ? ` Even after ${eventName.toLowerCase()},` : ",";
  const impact =
    metrics.housingSupply >= metrics.affordability
      ? `${impactSource}${eventContext} your group pushed the city toward longer-term supply change.`
      : `${impactSource}${eventContext} your group put more weight on stability for current residents.`;

  return { improved, worsened, impact };
}
