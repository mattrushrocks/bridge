import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function LobbyView({
  room,
  currentPlayer,
  onStart,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[1.75rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Shared Lobby</p>
        <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">Room {room.roomCode}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">
          You are working together to solve a real-world problem. Each of you has a different
          perspective. To succeed, you must share information and make a group decision.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!currentPlayer?.isHost || room.players.length < 2}
            onClick={onStart}
            className="cg-btn-primary rounded-full px-6 py-3 text-sm"
          >
            {currentPlayer?.isHost ? "Start Mission" : "Waiting for host"}
          </button>
          <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-muted)]">
            {room.players.length}/6 players connected
          </div>
        </div>
      </section>
    </div>
  );
}
