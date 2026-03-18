import { crisisEvents, policies, roles } from "../lib/gameData";
import { CrisisEvent, OutcomeMetrics, Policy, Role } from "../lib/gameTypes";
import { RoomOutcome } from "./roomTypes";

export function assignRoles(playerCount: number): Role[] {
  const available = [...roles].slice(0, Math.min(playerCount, roles.length));
  return shuffle(available);
}

export function getRandomCrisisEvent(): CrisisEvent {
  return crisisEvents[Math.floor(Math.random() * crisisEvents.length)];
}

export function calculateBudgetRemaining(
  spentCredits: number,
  budgetTotal: number,
  bonusBudget = 0,
): number {
  return budgetTotal + bonusBudget - spentCredits;
}

export function calculateOutcome(
  selectedPolicyIds: string[],
  event: CrisisEvent | null,
  boosts: {
    approvalBoost: number;
    supplyBoost: number;
    environmentalShield: boolean;
    transitEnvironmentalBonus: number;
  },
): RoomOutcome {
  const selectedPolicies = policies.filter((policy) => selectedPolicyIds.includes(policy.id));
  const baseMetrics: OutcomeMetrics = {
    housingSupply: 40,
    communityApproval: 55,
    environmentalImpact: 55,
    affordability: 42,
  };

  const metrics = selectedPolicies.reduce(
    (totals, policy) => ({
      housingSupply: totals.housingSupply + policy.effects.housingSupply,
      communityApproval: totals.communityApproval + policy.effects.communityApproval,
      environmentalImpact: totals.environmentalImpact + policy.effects.environmentalImpact,
      affordability: totals.affordability + policy.effects.affordability,
    }),
    baseMetrics,
  );

  const crisisAdjusted: OutcomeMetrics = event
    ? {
        housingSupply: clamp(metrics.housingSupply + event.modifiers.housingSupply),
        communityApproval: clamp(metrics.communityApproval + event.modifiers.communityApproval),
        environmentalImpact: clamp(metrics.environmentalImpact + event.modifiers.environmentalImpact),
        affordability: clamp(metrics.affordability + event.modifiers.affordability),
      }
    : {
        housingSupply: clamp(metrics.housingSupply),
        communityApproval: clamp(metrics.communityApproval),
        environmentalImpact: clamp(metrics.environmentalImpact),
        affordability: clamp(metrics.affordability),
      };

  const finalMetrics: OutcomeMetrics = {
    housingSupply: clamp(crisisAdjusted.housingSupply + boosts.supplyBoost),
    communityApproval: clamp(crisisAdjusted.communityApproval + boosts.approvalBoost),
    environmentalImpact: clamp(
      crisisAdjusted.environmentalImpact +
        (boosts.environmentalShield ? 8 : 0) +
        (selectedPolicyIds.some((policyId) => policyId !== "delay-action") ? boosts.transitEnvironmentalBonus : 0),
    ),
    affordability: crisisAdjusted.affordability,
  };

  return {
    metrics: finalMetrics,
    summary: generateMissionSummary(finalMetrics),
  };
}

export function generateMissionSummary(metrics: OutcomeMetrics): string {
  if (metrics.housingSupply >= 60 && metrics.affordability >= 55) {
    return "The group moved toward affordability and future supply, though the decision still carried visible tradeoffs.";
  }
  if (metrics.communityApproval >= 60 && metrics.affordability >= 55) {
    return "The group protected residents and preserved trust, but the longer-term shortage remains a live concern.";
  }
  if (metrics.housingSupply < 45 && metrics.affordability < 45) {
    return "The group avoided immediate disruption, but the housing problem kept worsening underneath the pause.";
  }
  return "The group found a partial balance, but no option solved the crisis cleanly for everyone involved.";
}

export function getPolicyById(policyId: string): Policy | undefined {
  return policies.find((policy) => policy.id === policyId);
}

export function getRoleById(roleId: string): Role | undefined {
  return roles.find((role) => role.id === roleId);
}

export function getEffectivePolicyCost(
  policyId: string,
  boosts: { zoningDiscount: number },
) {
  const policy = getPolicyById(policyId);
  if (!policy) return 0;
  if (policyId === "build-more-housing") {
    return Math.max(0, policy.cost - boosts.zoningDiscount);
  }
  return policy.cost;
}

function shuffle<T>(items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
