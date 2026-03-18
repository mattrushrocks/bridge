import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function InfoView({
  room,
  currentPlayer,
  onAdvance,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onAdvance: () => void;
}) {
  return (
    <section className="glass-panel-strong rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Before Discussion</p>
      <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">What happens next?</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">
        You will now discuss the Utah housing crisis together. Each player has different
        information, priorities, and goals.
      </p>
      <div className="mt-6 space-y-3">
        <div className="glass-chip rounded-2xl px-4 py-4 text-sm text-[var(--cg-ink)]">
          1. Share what matters most to your role.
        </div>
        <div className="glass-chip rounded-2xl px-4 py-4 text-sm text-[var(--cg-ink)]">
          2. Listen for what other players are protecting.
        </div>
        <div className="glass-chip rounded-2xl px-4 py-4 text-sm text-[var(--cg-ink)]">
          3. Make one group decision together.
        </div>
      </div>
      <button
        type="button"
        disabled={!currentPlayer?.isHost}
        onClick={onAdvance}
        className="cg-btn-primary mt-6 rounded-full px-6 py-3 text-sm"
      >
        {currentPlayer?.isHost ? "Open discussion" : "Waiting for host"}
      </button>
    </section>
  );
}
