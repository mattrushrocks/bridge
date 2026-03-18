import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function MissionBriefView({
  room,
  currentPlayer,
  onAdvance,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onAdvance: () => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Mission Brief</p>
        <h1 className="mt-3 text-5xl font-semibold text-white">Salt Lake City Housing Alert</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          Rent pressure is rising, political trust is fragile, and city leaders need a coordinated
          housing package that can survive a sudden crisis event.
        </p>
        <div className="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Mission Objective</p>
          <p className="mt-3 text-xl font-medium text-white">
            Build a viable housing response before the room runs out of time.
          </p>
        </div>
        <button
          type="button"
          disabled={!currentPlayer?.isHost}
          onClick={onAdvance}
          className="mt-6 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:bg-white/10 disabled:text-slate-500"
        >
          {currentPlayer?.isHost ? "Continue to role reveal" : "Waiting for host"}
        </button>
      </section>
    </div>
  );
}
