import { crisisEvents, policies, roles } from "@/lib/gameData";
import { CrisisEvent, OutcomeMetrics, Policy, Role } from "@/lib/gameTypes";

export function getRandomCrisisEvent(): CrisisEvent {
  return crisisEvents[Math.floor(Math.random() * crisisEvents.length)];
}

export function calculateBudgetRemaining(selectedPolicies: Policy[]): number {
  return 200 - selectedPolicies.reduce((sum, policy) => sum + policy.cost, 0);
}

export function calculateOutcome(
  selectedPolicies: Policy[],
  event: CrisisEvent | null,
): OutcomeMetrics {
  const baseMetrics: OutcomeMetrics = {
    housingSupply: 40,
    communityApproval: 55,
    environmentalImpact: 55,
    affordability: 42,
  };

  const policyTotals = selectedPolicies.reduce(
    (totals, policy) => ({
      housingSupply: totals.housingSupply + policy.effects.housingSupply,
      communityApproval: totals.communityApproval + policy.effects.communityApproval,
      environmentalImpact: totals.environmentalImpact + policy.effects.environmentalImpact,
      affordability: totals.affordability + policy.effects.affordability,
    }),
    baseMetrics,
  );

  const combined = event
    ? {
        housingSupply: policyTotals.housingSupply + event.modifiers.housingSupply,
        communityApproval: policyTotals.communityApproval + event.modifiers.communityApproval,
        environmentalImpact:
          policyTotals.environmentalImpact + event.modifiers.environmentalImpact,
        affordability: policyTotals.affordability + event.modifiers.affordability,
      }
    : policyTotals;

  return {
    housingSupply: clampMetric(combined.housingSupply),
    communityApproval: clampMetric(combined.communityApproval),
    environmentalImpact: clampMetric(combined.environmentalImpact),
    affordability: clampMetric(combined.affordability),
  };
}

export function generateMissionSummary(metrics: OutcomeMetrics): string {
  const strongCount = [
    metrics.housingSupply >= 60,
    metrics.communityApproval >= 55,
    metrics.environmentalImpact >= 55,
    metrics.affordability >= 55,
  ].filter(Boolean).length;

  if (strongCount >= 4) {
    return "Mission success. Your team built a plan that expanded housing, held public support, and stayed resilient under crisis pressure.";
  }

  if (metrics.communityApproval < 45) {
    return "Mission mixed. The package moved policy levers, but community trust weakened enough to threaten implementation.";
  }

  if (metrics.environmentalImpact < 45) {
    return "Mission mixed. The team improved housing pressure, but sustainability risk remained too high to ignore.";
  }

  if (metrics.affordability < 50 || metrics.housingSupply < 50) {
    return "Mission partial. The package created movement, but it did not relieve housing pressure enough to fully stabilize the situation.";
  }

  return "Mission stable. The team found a workable compromise, though several tradeoffs remain exposed.";
}

export function getSelectedPolicies(ids: string[]): Policy[] {
  return policies.filter((policy) => ids.includes(policy.id));
}

export function getAssignableRoles(playerCount: number): Role[] {
  return roles.slice(0, Math.min(playerCount, roles.length));
}

function clampMetric(value: number): number {
  return Math.max(0, Math.min(100, value));
}
