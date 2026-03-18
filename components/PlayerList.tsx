import { roles } from "@/lib/gameData";
import type { PlayerState, RoomState } from "@/server/roomTypes";

type PlayerListProps = {
  room: RoomState;
  currentPlayerId: string | null;
};

export default function PlayerList({ room, currentPlayerId }: PlayerListProps) {
  return (
    <section className="glass-panel rounded-[1.5rem] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">Team Roles</p>
      <div className="mt-4 space-y-3">
        {room.players.map((player) => {
          const spent = Object.values(room.policyContributions).reduce(
            (sum, ledger) => sum + (ledger[player.id] ?? 0),
            0,
          );
          const roleName = roles.find((role) => role.id === player.roleId)?.name;
          return (
            <div key={player.id} className="glass-chip rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      player.isConnected ? "bg-[var(--cg-green)] shadow-[0_0_14px_rgba(93,167,140,0.45)]" : "bg-slate-400"
                    }`}
                  />
                  <span className="font-medium text-[var(--cg-ink)]">
                    {player.name}
                    {player.id === currentPlayerId ? " (You)" : ""}
                  </span>
                </div>
                {player.isHost ? (
                  <span className="rounded-full bg-[rgba(217,164,79,0.16)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cg-amber)]">
                    Host
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-[var(--cg-muted)]">
                {player.roleId
                  ? `${roleName} · ${player.contributionBudget - spent} credits left`
                  : `Awaiting mission assignment`}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
