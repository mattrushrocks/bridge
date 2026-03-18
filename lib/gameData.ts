import { CrisisEvent, Policy, Role } from "@/lib/gameTypes";

export const missionStages = ["lobby", "role", "share", "decision", "outcome", "reflection"] as const;

export const roles: Role[] = [
  {
    id: "tenant",
    name: "Tenant",
    priority: "Affordability",
    goal: "Keep housing costs from pushing current residents out.",
    privateInfo: [
      "Renters in Salt Lake City are being priced out faster than wages are rising.",
      "If the group delays action, more households will be pushed into unstable housing this year.",
    ],
    specialAbility: "Ground Truth: remind the group what immediate affordability pressure feels like.",
    ability: {
      id: "ground-truth",
      name: "Ground Truth",
      description: "Adds a small affordability boost to the final outcome.",
    },
    contribution: 30,
    approvalKey: "Renter Impact",
    hiddenWarning: "Your concern is affordability. If the group moves too slowly, real households absorb the cost.",
    constraints: [
      "You care most about affordability.",
      "You push back on plans that preserve stability for everyone except renters.",
    ],
  },
  {
    id: "landlord",
    name: "Landlord",
    priority: "Investment stability",
    goal: "Keep housing viable without creating a system people stop participating in.",
    privateInfo: [
      "Unpredictable policy changes make smaller property owners more defensive and less willing to adapt quickly.",
      "A plan that protects residents but destabilizes basic property economics will face resistance.",
    ],
    specialAbility: "Stability Signal: improve confidence that the plan can actually hold.",
    ability: {
      id: "stability-signal",
      name: "Stability Signal",
      description: "Adds a small community-approval boost to the final outcome.",
    },
    contribution: 35,
    approvalKey: "Investment Stability",
    hiddenWarning: "Your concern is stability. A plan that feels financially chaotic may trigger backlash instead of cooperation.",
    constraints: [
      "You value investment stability.",
      "You support change when it does not create total uncertainty for owners and residents.",
    ],
  },
  {
    id: "city-planner",
    name: "City Planner",
    priority: "Long-term sustainability",
    goal: "Make sure the solution can hold up over time.",
    privateInfo: [
      "Current zoning and infrastructure rules limit how quickly new housing can be delivered.",
      "Long-term sustainability matters because short-term fixes can create bigger civic problems later.",
    ],
    specialAbility: "Policy Alignment: improve the long-term fit of the final plan.",
    ability: {
      id: "policy-alignment",
      name: "Policy Alignment",
      description: "Adds a small environmental-impact boost to the final outcome.",
    },
    contribution: 35,
    approvalKey: "Long-Term Fit",
    hiddenWarning: "Your concern is sustainability. Fast action that ignores long-term systems can worsen the crisis later.",
    constraints: [
      "You value long-term sustainability.",
      "You need the group to see beyond the next headline cycle.",
    ],
  },
  {
    id: "developer",
    name: "Housing Developer",
    priority: "Feasibility",
    goal: "Make sure any decision can actually turn into homes on the ground.",
    privateInfo: [
      "More homes can be built, but only if approval pathways are clear enough to reduce risk.",
      "If the group chooses to build but does not address feasibility, the promise will underdeliver.",
    ],
    specialAbility: "Delivery Push: improve the chance that the plan actually gets built.",
    ability: {
      id: "delivery-push",
      name: "Delivery Push",
      description: "Reduces the cost of building more housing by 10 credits.",
    },
    contribution: 40,
    approvalKey: "Delivery Feasibility",
    hiddenWarning: "Your concern is feasibility. The group can promise new housing, but delivery still has to be realistic.",
    constraints: [
      "You value feasibility.",
      "You support bold plans only if they can actually be delivered.",
    ],
  },
  {
    id: "community-leader",
    name: "Community Leader",
    priority: "Fairness",
    goal: "Protect current residents and preserve trust in the process.",
    privateInfo: [
      "Residents are more open to change when they feel protected, informed, and included in the process.",
      "Visible resident protections can reduce backlash even when tradeoffs are difficult.",
    ],
    specialAbility: "Trust Builder: increase the sense that the plan treats people fairly.",
    ability: {
      id: "trust-builder",
      name: "Trust Builder",
      description: "Adds a stronger community-approval boost to the final outcome.",
    },
    contribution: 30,
    approvalKey: "Resident Trust",
    hiddenWarning: "Your concern is fairness. Ignoring current residents may make the plan politically and socially unsustainable.",
    constraints: [
      "You value fairness and community trust.",
      "You need residents to see a place for themselves in the plan.",
    ],
  },
  {
    id: "transit-advocate",
    name: "Transit Advocate",
    priority: "Access",
    goal: "Keep housing connected to how people actually move and live.",
    privateInfo: [
      "Housing works better when access, mobility, and neighborhood connection improve alongside it.",
      "If the group delays action too often, infrastructure pressure keeps building without solving access.",
    ],
    specialAbility: "Access Lens: improve the long-term public value of an active plan.",
    ability: {
      id: "access-lens",
      name: "Access Lens",
      description: "Adds an environmental and community bonus if the group chooses a proactive option.",
    },
    contribution: 30,
    approvalKey: "Access Alignment",
    hiddenWarning: "Your concern is access. A plan that ignores mobility and neighborhood connection will leave important needs unresolved.",
    constraints: [
      "You value public access and long-term connection.",
      "You push for plans that consider how people actually move through the city.",
    ],
  },
];

export const policies: Policy[] = [
  {
    id: "build-more-housing",
    name: "Build More Housing",
    cost: 80,
    description: "Prioritize faster housing construction to increase supply and reduce long-term scarcity.",
    requirements: [
      { key: "delivery-feasibility", label: "Delivery Feasibility", roleId: "developer" },
      { key: "long-term-fit", label: "Long-Term Fit", roleId: "city-planner" },
      { key: "renter-impact", label: "Renter Impact", roleId: "tenant" },
    ],
    effects: {
      housingSupply: 18,
      communityApproval: -4,
      environmentalImpact: 4,
      affordability: 12,
    },
  },
  {
    id: "protect-current-residents",
    name: "Protect Current Residents",
    cost: 70,
    description: "Focus on rent stabilization, resident protections, and safeguards against displacement.",
    requirements: [
      { key: "resident-trust", label: "Resident Trust", roleId: "community-leader" },
      { key: "investment-stability", label: "Investment Stability", roleId: "landlord" },
      { key: "renter-impact", label: "Renter Impact", roleId: "tenant" },
    ],
    effects: {
      housingSupply: 4,
      communityApproval: 14,
      environmentalImpact: 2,
      affordability: 14,
    },
  },
  {
    id: "delay-action",
    name: "Create a Utah Housing Advocate",
    cost: 20,
    description:
      "Create a Utah housing advocate role to address landlord-renter disputes, uphold housing standards, and advocate for both renters and landlords to improve quality of life for residents.",
    requirements: [
      { key: "resident-trust", label: "Resident Trust", roleId: "community-leader" },
      { key: "investment-stability", label: "Investment Stability", roleId: "landlord" },
      { key: "access-alignment", label: "Access Alignment", roleId: "transit-advocate" },
    ],
    effects: {
      housingSupply: 1,
      communityApproval: 12,
      environmentalImpact: 2,
      affordability: 8,
    },
  },
];

export const crisisEvents: CrisisEvent[] = [
  {
    id: "rent-spike",
    name: "Rent Spike",
    description: "Market pressure accelerates and renters feel the crisis more immediately than expected.",
    modifiers: {
      housingSupply: 0,
      communityApproval: -2,
      environmentalImpact: 0,
      affordability: -12,
    },
  },
  {
    id: "neighborhood-backlash",
    name: "Neighborhood Backlash",
    description: "A local coalition pushes back against rapid change and raises the political cost of visible disruption.",
    modifiers: {
      housingSupply: 0,
      communityApproval: -10,
      environmentalImpact: 0,
      affordability: 0,
    },
  },
  {
    id: "state-funding-window",
    name: "State Funding Window",
    description: "A short-lived funding opportunity appears for groups that can act with a credible shared plan.",
    modifiers: {
      housingSupply: 6,
      communityApproval: 4,
      environmentalImpact: 2,
      affordability: 6,
    },
  },
];
