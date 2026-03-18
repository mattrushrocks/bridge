import { policies } from "@/lib/gameData";
import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function DecisionPhaseView({
  room,
  currentPlayer,
  errorMessage,
  onSelectPolicy,
  onDeselectPolicy,
  onAdvance,
  onToggleReady,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  errorMessage: string | null;
  onSelectPolicy: (policyId: string) => void;
  onDeselectPolicy: (policyId: string) => void;
  onAdvance: () => void;
  onToggleReady: () => void;
}) {
  const isReady = Boolean(currentPlayer && room.readyPlayers.includes(currentPlayer.id));
  const hasSelection = room.selectedPolicies.length > 0;

  return (
    <section className="glass-panel-strong rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Decide</p>
      <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">What should the group do?</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">
        Discuss together, then confirm when your group is ready.
      </p>

      <div className="mt-6 grid gap-4">
        {policies.map((policy) => {
          const selected = room.selectedPolicies.includes(policy.id);
          const tradeoff = getPolicyTradeoff(policy.id, currentPlayer?.roleId ?? null);

          return (
            <button
              key={policy.id}
              type="button"
              onClick={() => (selected ? onDeselectPolicy(policy.id) : onSelectPolicy(policy.id))}
              className={`rounded-[1.5rem] border p-5 text-left transition ${
                selected
                  ? "border-[var(--cg-blue)] bg-[rgba(120,167,255,0.12)]"
                  : "border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)] hover:border-[rgba(120,167,255,0.32)]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--cg-muted)]">
                Group Option
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--cg-ink)]">{policy.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--cg-muted)]">{policy.description}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--cg-line)] bg-[rgba(5,9,18,0.42)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-green)]">
                    What this helps
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--cg-ink)]">{tradeoff.helps}</p>
                </div>
                <div className="rounded-2xl border border-[var(--cg-line)] bg-[rgba(5,9,18,0.42)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-amber)]">
                    What this risks
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--cg-ink)]">{tradeoff.risks}</p>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-[var(--cg-line)] bg-[rgba(5,9,18,0.42)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-blue)]">
                  Question for your role
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--cg-ink)]">{tradeoff.roleQuestion}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-green)]">
          {hasSelection ? "Response saved ✓" : "Waiting for a group choice..."}
        </div>
        <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-muted)]">
          {room.readyPlayers.length} of {room.players.length} players ready
        </div>
        <button
          type="button"
          onClick={onToggleReady}
          className={`${isReady ? "cg-btn-secondary" : "cg-btn-primary"} rounded-full px-6 py-3 text-sm`}
        >
          {isReady ? "Edit my choice" : "I am ready"}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl bg-[rgba(204,107,104,0.14)] px-4 py-3 text-sm text-[var(--cg-red)]">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="button"
        disabled={!currentPlayer?.isHost || !hasSelection || room.readyPlayers.length !== room.players.length}
        onClick={onAdvance}
        className="cg-btn-primary mt-6 rounded-full px-6 py-3 text-sm"
      >
        {currentPlayer?.isHost ? "Host will advance when everyone is ready" : "Waiting for host"}
      </button>
    </section>
  );
}

function getPolicyTradeoff(policyId: string, roleId: string | null) {
  const rolePrompt = getRolePrompt(roleId);

  switch (policyId) {
    case "build-more-housing":
      return {
        helps: "More homes may ease long-term shortage and improve future affordability.",
        risks: "Faster change can reduce trust if residents feel overlooked or disrupted.",
        roleQuestion: `${rolePrompt} Can your role support faster growth if some people feel the pace is too aggressive?`,
      };
    case "protect-current-residents":
      return {
        helps: "Current residents get more immediate stability and protection from displacement pressure.",
        risks: "The shortage may continue if protection comes without enough new supply.",
        roleQuestion: `${rolePrompt} Can your role accept slower structural change in exchange for stronger short-term protection?`,
      };
    case "delay-action":
      return {
        helps: "The group creates a direct place to resolve disputes, protect standards, and improve trust between renters and landlords.",
        risks: "A local advocacy office may ease harm, but it does not add much new housing supply on its own.",
        roleQuestion: `${rolePrompt} Is relationship repair and stronger standards enough if the larger housing shortage still needs action?`,
      };
    default:
      return {
        helps: "This option improves one part of the problem.",
        risks: "It also creates a meaningful tradeoff elsewhere.",
        roleQuestion: `${rolePrompt} What would your role need before supporting this?`,
      };
  }
}

function getRolePrompt(roleId: string | null) {
  switch (roleId) {
    case "tenant":
      return "From a renter perspective,";
    case "landlord":
      return "From a stability perspective,";
    case "city-planner":
      return "From a long-term city perspective,";
    case "developer":
      return "From a feasibility perspective,";
    case "community-leader":
      return "From a fairness perspective,";
    case "transit-advocate":
      return "From an access perspective,";
    default:
      return "From your role's perspective,";
  }
}
