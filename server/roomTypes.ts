import { CrisisEvent, OutcomeMetrics, ReflectionAnswers } from "../lib/gameTypes";

export type Phase =
  | "lobby"
  | "role"
  | "info"
  | "share"
  | "decision"
  | "outcome"
  | "reflection";

export type ChatMessage = {
  id: string;
  playerId: string;
  senderName: string;
  timestamp: number;
  content: string;
};

export type PlayerState = {
  id: string;
  socketId: string;
  name: string;
  isHost: boolean;
  isConnected: boolean;
  roleId: string | null;
  contributionBudget: number;
  abilityUsed: boolean;
  reflectionAnswers: ReflectionAnswers | null;
};

export type RoomOutcome = {
  metrics: OutcomeMetrics;
  summary: string;
};

export type RoomState = {
  roomCode: string;
  players: PlayerState[];
  hostPlayerId: string;
  phase: Phase;
  phaseStartedAt: number;
  countdownSeconds: number | null;
  readyPlayers: string[];
  assignedRoles: Record<string, string>;
  selectedPolicies: string[];
  policyApprovals: Record<string, string[]>;
  policyContributions: Record<string, Record<string, number>>;
  activatedPolicies: string[];
  activeCrisisEvent: CrisisEvent | null;
  lockedPlan: string[] | null;
  outcome: RoomOutcome | null;
  reflections: Record<string, ReflectionAnswers>;
  chatMessages: ChatMessage[];
  budgetTotal: number;
  bonusBudget: number;
  abilityBoosts: {
    approvalBoost: number;
    supplyBoost: number;
    environmentalShield: boolean;
    zoningDiscount: number;
    transitEnvironmentalBonus: number;
  };
};

export type RoomTimerSync = {
  roomCode: string;
  phase: Phase;
  phaseStartedAt: number;
  countdownSeconds: number | null;
};
