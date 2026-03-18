import { policies } from "@/lib/gameData";

type SharedPlanPanelProps = {
  selectedPolicyIds: string[];
  activatedPolicyIds?: string[];
  budgetTotal: number;
  bonusBudget?: number;
  contributions?: Record<string, Record<string, number>>;
};

export default function SharedPlanPanel({
  selectedPolicyIds,
  activatedPolicyIds = [],
  budgetTotal,
  bonusBudget = 0,
  contributions = {},
}: SharedPlanPanelProps) {
  const selectedPolicies = policies.filter((policy) => selectedPolicyIds.includes(policy.id));
  const spent = Object.values(contributions).reduce(
    (roomSum, ledger) => roomSum + Object.values(ledger).reduce((policySum, value) => policySum + value, 0),
    0,
  );
  const remaining = budgetTotal + bonusBudget - spent;

  return (
    <section className="glass-panel rounded-[1.5rem] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">Group Decision</p>
      <div className="mt-4 rounded-[1.25rem] border border-[var(--cg-line)] bg-[rgba(2,6,23,0.36)] p-4">
        <div className="flex items-center justify-between text-sm text-[var(--cg-muted)]">
          <span>Budget used</span>
          <span className="font-semibold text-[var(--cg-blue)]">
            {spent} / {budgetTotal + bonusBudget}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800/80">
          <div
            className={`h-full rounded-full ${remaining < 0 ? "bg-[var(--cg-red)]" : "bg-gradient-to-r from-[var(--cg-blue)] to-[var(--cg-green)]"}`}
            style={{ width: `${Math.min(100, Math.max(0, (spent / budgetTotal) * 100))}%` }}
          />
        </div>
        <p className={`mt-3 text-sm font-medium ${remaining < 0 ? "text-[var(--cg-red)]" : "text-[var(--cg-ink)]"}`}>
          Budget remaining: {remaining}
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {selectedPolicies.length > 0 ? (
          selectedPolicies.map((policy) => (
            <div key={policy.id} className="glass-chip rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-[var(--cg-ink)]">{policy.name}</span>
                <span className="text-sm text-[var(--cg-blue)]">
                  {Object.values(contributions[policy.id] ?? {}).reduce((sum, value) => sum + value, 0)}
                </span>
              </div>
              <p className={`mt-2 text-xs uppercase tracking-[0.18em] ${activatedPolicyIds.includes(policy.id) ? "text-[var(--cg-green)]" : "text-[var(--cg-amber)]"}`}>
                {activatedPolicyIds.includes(policy.id) ? "Activated" : "Pending unlock"}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/30 px-4 py-6 text-sm text-[var(--cg-muted)]">
            No group decision selected yet.
          </div>
        )}
      </div>
    </section>
  );
}
