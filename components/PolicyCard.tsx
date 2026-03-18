import { roles } from "@/lib/gameData";
import { Policy } from "@/lib/gameTypes";

type PolicyCardProps = {
  policy: Policy;
  selected: boolean;
  onSelect: (policyId: string) => void;
  onDeselect: (policyId: string) => void;
  approvals: string[];
  contributionTotal: number;
  effectiveCost: number;
  currentPlayerRoleId: string | null;
  currentPlayerId: string | null;
  currentPlayerContribution: number;
  contributionRemaining: number;
  activated: boolean;
  onToggleApproval: (policyId: string) => void;
  onContribute: (policyId: string, delta: number) => void;
};

export default function PolicyCard({
  policy,
  selected,
  onSelect,
  onDeselect,
  approvals,
  contributionTotal,
  effectiveCost,
  currentPlayerRoleId,
  currentPlayerContribution,
  contributionRemaining,
  activated,
  onToggleApproval,
  onContribute,
}: PolicyCardProps) {
  const relevantRequirement = policy.requirements.find((requirement) => requirement.roleId === currentPlayerRoleId);
  const approvedByMe = Boolean(currentPlayerRoleId && approvals.includes(currentPlayerRoleId));

  return (
    <article
      className={`rounded-[1.5rem] border p-5 backdrop-blur-xl ${
        activated
          ? "border-[rgba(93,167,140,0.35)] bg-[rgba(93,167,140,0.14)]"
          : selected
            ? "border-[rgba(103,135,255,0.35)] bg-[rgba(103,135,255,0.12)]"
            : "border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--cg-muted)]">Group Option</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--cg-ink)]">{policy.name}</h3>
        </div>
        <div className="glass-chip rounded-full px-4 py-2 text-sm font-semibold text-[var(--cg-blue)]">
          Cost {effectiveCost}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--cg-muted)]">{policy.description}</p>
      <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <div className="glass-chip rounded-2xl px-3 py-2 text-[var(--cg-ink)]">{describeEffect("supply", policy.effects.housingSupply)}</div>
        <div className="glass-chip rounded-2xl px-3 py-2 text-[var(--cg-ink)]">{describeEffect("approval", policy.effects.communityApproval)}</div>
        <div className="glass-chip rounded-2xl px-3 py-2 text-[var(--cg-ink)]">{describeEffect("environment", policy.effects.environmentalImpact)}</div>
        <div className="glass-chip rounded-2xl px-3 py-2 text-[var(--cg-ink)]">{describeEffect("affordability", policy.effects.affordability)}</div>
      </div>
      <div className="mt-5 rounded-[1.25rem] border border-[var(--cg-line)] bg-[rgba(2,6,23,0.36)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-muted)]">Approvals required</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {policy.requirements.map((requirement) => {
            const roleName = roles.find((role) => role.id === requirement.roleId)?.name ?? requirement.label;
            const approved = approvals.includes(requirement.roleId);
            return (
              <span
                key={requirement.key}
                className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                  approved
                    ? "bg-[rgba(93,167,140,0.18)] text-[var(--cg-green)]"
                    : "border border-[var(--cg-line)] bg-[rgba(15,23,38,0.86)] text-[var(--cg-muted)]"
                }`}
              >
                {approved ? "Approved" : "Pending"} · {roleName}
              </span>
            );
          })}
        </div>
        {relevantRequirement ? (
          <button
            type="button"
            onClick={() => onToggleApproval(policy.id)}
            className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold ${
              approvedByMe
                ? "cg-btn-secondary text-sm"
                : "cg-btn-primary text-sm"
            }`}
          >
            {approvedByMe ? `Revoke ${relevantRequirement.label}` : `Approve ${relevantRequirement.label}`}
          </button>
        ) : null}
      </div>
      <div className="mt-5 rounded-[1.25rem] border border-[var(--cg-line)] bg-[rgba(2,6,23,0.36)] p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-muted)]">Funding</p>
          <p className="text-sm font-semibold text-[var(--cg-blue)]">
            {contributionTotal} / {effectiveCost}
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800/80">
          <div
            className={`h-full rounded-full ${activated ? "bg-[var(--cg-green)]" : "bg-[var(--cg-blue)]"}`}
            style={{ width: `${Math.min(100, (contributionTotal / Math.max(effectiveCost, 1)) * 100)}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onContribute(policy.id, -10)}
            disabled={currentPlayerContribution <= 0}
            className="cg-btn-secondary rounded-full px-4 py-2 text-sm"
          >
            -10
          </button>
          <button
            type="button"
            onClick={() => onContribute(policy.id, 10)}
            disabled={contributionRemaining < 10}
            className="cg-btn-primary rounded-full px-4 py-2 text-sm"
          >
            +10
          </button>
          <span className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-muted)]">
            Your contribution: {currentPlayerContribution}
          </span>
          <span className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-muted)]">
            Remaining: {contributionRemaining}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => (selected ? onDeselect(policy.id) : onSelect(policy.id))}
        className={`mt-5 rounded-full px-5 py-3 text-sm font-semibold transition ${
          selected ? "cg-btn-secondary" : "cg-btn-primary"
        }`}
      >
        {selected ? "Clear this option" : "Choose this option"}
      </button>
      <p className={`mt-4 text-xs font-semibold uppercase tracking-[0.18em] ${activated ? "text-[var(--cg-green)]" : "text-[var(--cg-amber)]"}`}>
        {activated ? "Activated and ready for lock-in" : "Locked until approvals and funding are complete"}
      </p>
    </article>
  );
}

function describeEffect(type: "supply" | "approval" | "environment" | "affordability", value: number) {
  const strength = Math.abs(value) >= 10 ? "strong" : "moderate";

  if (type === "supply") return `${strength} boost to housing supply`;
  if (type === "approval") return value >= 0 ? `${strength} support for public trust` : `${strength} risk to community trust`;
  if (type === "environment") return value >= 0 ? `${strength} environmental stability` : `${strength} environmental strain`;
  return value >= 0 ? `${strength} help for affordability` : `${strength} affordability risk`;
}
