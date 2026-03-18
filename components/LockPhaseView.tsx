import { policies } from "@/lib/gameData";
import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function LockPhaseView({
  room,
  currentPlayer,
  onAdvance,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onAdvance: () => void;
}) {
  const lockedPolicies = policies.filter((policy) => (room.lockedPlan ?? room.selectedPolicies).includes(policy.id));

  return (
    <section className="rounded-[1.75rem] border border-rose-400/30 bg-slate-950/60 p-6 shadow-[0_0_40px_rgba(251,113,133,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">Final Decision Lock</p>
      <h1 className="mt-3 text-5xl font-semibold text-white">Final plan sealing in</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
        Policy changes are frozen. Mission control is preparing the final outcome based on the locked package.
      </p>
      <div className="mt-6 space-y-3">
        {lockedPolicies.map((policy) => (
          <div key={policy.id} className="rounded-2xl bg-white/5 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-medium text-white">{policy.name}</span>
              <span className="text-sm text-cyan-200">{policy.cost}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={!currentPlayer?.isHost}
        onClick={onAdvance}
        className="mt-6 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:bg-white/10 disabled:text-slate-500"
      >
        {currentPlayer?.isHost ? "Reveal outcome now" : "Waiting for host"}
      </button>
    </section>
  );
}
