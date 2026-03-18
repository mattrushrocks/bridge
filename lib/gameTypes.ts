export type RoleAbility = {
  id: string;
  name: string;
  description: string;
};

export type Role = {
  id: string;
  name: string;
  priority: string;
  goal: string;
  privateInfo: string[];
  specialAbility: string;
  ability: RoleAbility;
  contribution: number;
  approvalKey: string;
  hiddenWarning: string;
  constraints: string[];
};

export type PolicyRequirement = {
  key: string;
  label: string;
  roleId: string;
};

export type Policy = {
  id: string;
  name: string;
  cost: number;
  description: string;
  requirements: PolicyRequirement[];
  effects: {
    housingSupply: number;
    communityApproval: number;
    environmentalImpact: number;
    affordability: number;
  };
};

export type CrisisEvent = {
  id: string;
  name: string;
  description: string;
  modifiers: {
    housingSupply: number;
    communityApproval: number;
    environmentalImpact: number;
    affordability: number;
  };
};

export type OutcomeMetrics = {
  housingSupply: number;
  communityApproval: number;
  environmentalImpact: number;
  affordability: number;
};

export type ReflectionAnswers = {
  changedThinking: string;
  listened: string;
  compromise: string;
  nextTime: string;
};
