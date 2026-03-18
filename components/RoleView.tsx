import { roles } from "@/lib/gameData";
import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function RoleView({
  room,
  currentPlayer,
  onAdvance,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onAdvance: () => void;
}) {
  const role = roles.find((entry) => entry.id === currentPlayer?.roleId);

  return (
    <section className="glass-panel-strong rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Role</p>
      <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">{role?.name ?? "Waiting for role"}</h1>
      {role ? (
        <div className="mt-6 space-y-4">
          <div className="glass-chip rounded-[1.5rem] px-4 py-4">
            <p className="text-sm font-medium text-[var(--cg-blue)]">Priority</p>
            <p className="mt-1 text-base text-[var(--cg-ink)]">{role.priority}</p>
          </div>
          <div className="glass-chip rounded-[1.5rem] px-4 py-4">
            <p className="text-sm font-medium text-[var(--cg-green)]">Goal</p>
            <p className="mt-1 text-base text-[var(--cg-ink)]">{role.goal}</p>
          </div>
          <div className="glass-chip rounded-[1.5rem] px-4 py-4">
            <p className="text-sm font-medium text-[var(--cg-amber)]">What only you know</p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--cg-ink)]">
              {role.privateInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        disabled={!currentPlayer?.isHost}
        onClick={onAdvance}
        className="cg-btn-primary mt-6 rounded-full px-6 py-3 text-sm"
      >
        {currentPlayer?.isHost ? "Open share round" : "Waiting for host"}
      </button>
    </section>
  );
}
