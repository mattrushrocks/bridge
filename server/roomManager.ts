import { policies, roles } from "../lib/gameData";
import { ReflectionAnswers } from "../lib/gameTypes";
import {
  assignRoles,
  calculateBudgetRemaining,
  calculateOutcome,
  getEffectivePolicyCost,
  getPolicyById,
  getRandomCrisisEvent,
  getRoleById,
} from "./gameEngine";
import { ChatMessage, Phase, PlayerState, RoomState } from "./roomTypes";

type RoomEventName =
  | "room_updated"
  | "room_created"
  | "room_joined"
  | "player_joined"
  | "player_left"
  | "game_started"
  | "phase_changed"
  | "crisis_event_triggered"
  | "outcome_ready"
  | "reflection_submitted"
  | "chat_message"
  | "approval_updated"
  | "contribution_updated"
  | "ability_used";

type RoomListener = (event: RoomEventName, room: RoomState, payload?: unknown) => void;
type RoomDeleteListener = (roomCode: string) => void;

const rooms = new Map<string, RoomState>();
let roomListener: RoomListener | null = null;
let roomDeleteListener: RoomDeleteListener | null = null;

export function setRoomEventListeners(listener: RoomListener, deleteListener: RoomDeleteListener) {
  roomListener = listener;
  roomDeleteListener = deleteListener;
}

export function createRoom(
  hostPlayer: Omit<
    PlayerState,
    "isHost" | "isConnected" | "roleId" | "reflectionAnswers" | "contributionBudget" | "abilityUsed"
  >,
) {
  const roomCode = generateRoomCode();
  const room: RoomState = {
    roomCode,
    players: [
      {
        ...hostPlayer,
        isHost: true,
        isConnected: true,
        roleId: null,
        contributionBudget: 0,
        abilityUsed: false,
        reflectionAnswers: null,
      },
    ],
    hostPlayerId: hostPlayer.id,
    phase: "lobby",
    phaseStartedAt: Date.now(),
    countdownSeconds: null,
    readyPlayers: [],
    assignedRoles: {},
    selectedPolicies: [],
    policyApprovals: {},
    policyContributions: {},
    activatedPolicies: [],
    activeCrisisEvent: null,
    lockedPlan: null,
    outcome: null,
    reflections: {},
    chatMessages: [],
    budgetTotal: 200,
    bonusBudget: 0,
    abilityBoosts: {
      approvalBoost: 0,
      supplyBoost: 0,
      environmentalShield: false,
      zoningDiscount: 0,
      transitEnvironmentalBonus: 0,
    },
  };

  rooms.set(roomCode, room);
  notify("room_created", room);
  notify("room_updated", room);
  return room;
}

export function joinRoom(
  roomCode: string,
  player: Omit<
    PlayerState,
    "isHost" | "isConnected" | "roleId" | "reflectionAnswers" | "contributionBudget" | "abilityUsed"
  >,
) {
  const room = getRoomOrThrow(roomCode);
  if (room.players.length >= 6) {
    throw new Error("This room is already full.");
  }

  const nextPlayer: PlayerState = {
    ...player,
    isHost: false,
    isConnected: true,
    roleId: null,
    contributionBudget: 0,
    abilityUsed: false,
    reflectionAnswers: null,
  };

  room.players.push(nextPlayer);
  notify("player_joined", room, nextPlayer);
  notify("room_joined", room, nextPlayer);
  notify("room_updated", room);
  return room;
}

export function leaveRoom(roomCode: string, playerId: string) {
  const room = rooms.get(roomCode);
  if (!room) return null;

  room.players = room.players.filter((player) => player.id !== playerId);
  delete room.assignedRoles[playerId];
  delete room.reflections[playerId];

  if (room.players.length === 0) {
    rooms.delete(roomCode);
    roomDeleteListener?.(roomCode);
    return null;
  }

  assignNewHostIfNeeded(room);
  notify("player_left", room, { playerId });
  notify("room_updated", room);
  return room;
}

export function getRoom(roomCode: string) {
  return rooms.get(roomCode) ?? null;
}

export function getAllRooms() {
  return Array.from(rooms.values());
}

export function startGame(roomCode: string) {
  const room = getRoomOrThrow(roomCode);
  if (room.players.length < 2) {
    throw new Error("At least 2 players are required to start the mission.");
  }
  const assigned = assignRoles(room.players.length);

  room.assignedRoles = {};
  room.players = room.players.map((player, index) => {
    const role = assigned[index];
    room.assignedRoles[player.id] = role.id;
    return {
      ...player,
      roleId: role.id,
      contributionBudget: getRoleById(role.id)?.contribution ?? 0,
      abilityUsed: false,
      reflectionAnswers: null,
    };
  });
  room.selectedPolicies = [];
  room.policyApprovals = {};
  room.policyContributions = {};
  room.activatedPolicies = [];
  room.activeCrisisEvent = null;
  room.lockedPlan = null;
  room.outcome = null;
  room.reflections = {};
  room.chatMessages = [];
  room.readyPlayers = [];
  room.bonusBudget = 0;
  room.abilityBoosts = {
    approvalBoost: 0,
    supplyBoost: 0,
    environmentalShield: false,
    zoningDiscount: 0,
    transitEnvironmentalBonus: 0,
  };

  setPhase(room, "role");
  notify("game_started", room);
  notify("room_updated", room);
  return room;
}

export function advancePhase(roomCode: string) {
  const room = getRoomOrThrow(roomCode);

  switch (room.phase) {
    case "lobby":
      return startGame(roomCode);
    case "role":
      setPhase(room, "info");
      break;
    case "info":
      setPhase(room, "share");
      break;
    case "share":
      ensureEveryoneReady(room);
      if (new Set(room.chatMessages.map((message) => message.playerId)).size < 2) {
        throw new Error("At least two players need to contribute in chat before planning begins.");
      }
      setPhase(room, "decision");
      room.activeCrisisEvent = getRandomCrisisEvent();
      notify("crisis_event_triggered", room, room.activeCrisisEvent);
      break;
    case "decision":
      ensureEveryoneReady(room);
      room.lockedPlan = [...room.selectedPolicies];
      room.outcome = calculateOutcome(room.lockedPlan, room.activeCrisisEvent, room.abilityBoosts);
      setPhase(room, "outcome");
      notify("outcome_ready", room, room.outcome);
      break;
    case "outcome":
      setPhase(room, "reflection");
      break;
    case "reflection":
      break;
  }

  notify("phase_changed", room, { phase: room.phase });
  notify("room_updated", room);
  return room;
}

export function selectPolicy(roomCode: string, policyId: string) {
  const room = getRoomOrThrow(roomCode);
  if (room.phase !== "decision") {
    throw new Error("Policies can only be changed during the decision phase.");
  }
  if (room.selectedPolicies.includes(policyId)) {
    return room;
  }
  const policy = getPolicyById(policyId);
  if (!policy) {
    throw new Error("Unknown policy.");
  }

  const existingApprovals = room.policyApprovals[policyId] ?? [];
  const existingContributions = room.policyContributions[policyId] ?? {};
  room.selectedPolicies = [policyId];
  room.policyApprovals = { [policyId]: existingApprovals };
  room.policyContributions = { [policyId]: existingContributions };
  room.activatedPolicies = [policyId];
  notify("room_updated", room);
  return room;
}

export function deselectPolicy(roomCode: string, policyId: string) {
  const room = getRoomOrThrow(roomCode);
  if (room.phase !== "decision") {
    throw new Error("Policies can only be changed during the decision phase.");
  }
  room.selectedPolicies = room.selectedPolicies.filter((id) => id !== policyId);
  room.policyApprovals = {};
  room.policyContributions = {};
  room.activatedPolicies = [];
  notify("room_updated", room);
  return room;
}

export function approvePolicyRequirement(roomCode: string, policyId: string, playerId: string) {
  const room = getRoomOrThrow(roomCode);
  if (room.phase !== "decision") {
    throw new Error("Approvals can only be changed during the decision phase.");
  }

  const player = room.players.find((entry) => entry.id === playerId);
  const policy = getPolicyById(policyId);
  if (!player || !player.roleId || !policy) {
    throw new Error("Invalid approval request.");
  }

  const relevantRequirement = policy.requirements.find((requirement) => requirement.roleId === player.roleId);
  if (!relevantRequirement) {
    throw new Error("Your role cannot approve this policy.");
  }

  const approvals = new Set(room.policyApprovals[policyId] ?? []);
  if (approvals.has(player.roleId)) {
    approvals.delete(player.roleId);
  } else {
    approvals.add(player.roleId);
  }
  room.policyApprovals[policyId] = Array.from(approvals);
  recomputeActivatedPolicies(room);
  notify("approval_updated", room, { policyId });
  notify("room_updated", room);
  return room;
}

export function contributePolicy(roomCode: string, policyId: string, playerId: string, delta: number) {
  const room = getRoomOrThrow(roomCode);
  if (room.phase !== "decision") {
    throw new Error("Contributions can only be changed during the decision phase.");
  }
  if (![10, -10].includes(delta)) {
    throw new Error("Contribution changes must be in 10-credit steps.");
  }
  if (!room.selectedPolicies.includes(policyId)) {
    throw new Error("Select the policy before contributing to it.");
  }

  const player = room.players.find((entry) => entry.id === playerId);
  if (!player) {
    throw new Error("Player not found in room.");
  }

  const policyLedger = { ...(room.policyContributions[policyId] ?? {}) };
  const currentContribution = policyLedger[playerId] ?? 0;
  const nextContribution = currentContribution + delta;
  if (nextContribution < 0) {
    throw new Error("Contribution cannot go below zero.");
  }

  const remaining = getPlayerContributionRemaining(room, playerId);
  if (delta > 0 && remaining < delta) {
    throw new Error("You do not have enough personal contribution points remaining.");
  }

  policyLedger[playerId] = nextContribution;
  room.policyContributions[policyId] = policyLedger;

  const spentCredits = getTotalCommittedCredits(room);
  const budgetRemaining = calculateBudgetRemaining(spentCredits, room.budgetTotal, room.bonusBudget);
  if (budgetRemaining < 0) {
    policyLedger[playerId] = currentContribution;
    room.policyContributions[policyId] = policyLedger;
    throw new Error("Shared contribution pool exceeded.");
  }

  recomputeActivatedPolicies(room);
  notify("contribution_updated", room, { policyId, playerId, delta });
  notify("room_updated", room);
  return room;
}

export function useSpecialAbility(roomCode: string, playerId: string) {
  const room = getRoomOrThrow(roomCode);
  const player = room.players.find((entry) => entry.id === playerId);
  if (!player || !player.roleId) {
    throw new Error("Player role not assigned.");
  }
  if (player.abilityUsed) {
    throw new Error("You have already used your special ability.");
  }

  switch (player.roleId) {
    case "tenant":
      room.abilityBoosts.supplyBoost += 4;
      break;
    case "landlord":
      room.abilityBoosts.approvalBoost += 6;
      break;
    case "city-planner":
      room.abilityBoosts.environmentalShield = true;
      break;
    case "community-leader":
      room.abilityBoosts.approvalBoost += 10;
      break;
    case "developer":
      room.abilityBoosts.zoningDiscount = 10;
      break;
    case "transit-advocate":
      room.abilityBoosts.transitEnvironmentalBonus += 6;
      break;
    default:
      break;
  }

  player.abilityUsed = true;
  recomputeActivatedPolicies(room);
  notify("ability_used", room, { playerId, roleId: player.roleId });
  notify("room_updated", room);
  return room;
}

export function submitReflection(roomCode: string, playerId: string, answers: ReflectionAnswers) {
  const room = getRoomOrThrow(roomCode);
  const player = room.players.find((entry) => entry.id === playerId);
  if (!player) {
    throw new Error("Player not found in room.");
  }

  player.reflectionAnswers = answers;
  room.reflections[playerId] = answers;
  notify("reflection_submitted", room, { playerId, answers });
  notify("room_updated", room);
  return room;
}

export function toggleReady(roomCode: string, playerId: string) {
  const room = getRoomOrThrow(roomCode);
  const ready = new Set(room.readyPlayers);
  if (ready.has(playerId)) {
    ready.delete(playerId);
  } else {
    ready.add(playerId);
  }
  room.readyPlayers = Array.from(ready);
  notify("room_updated", room);
  return room;
}

export function addChatMessage(roomCode: string, playerId: string, content: string) {
  const room = getRoomOrThrow(roomCode);
  const player = room.players.find((entry) => entry.id === playerId);
  if (!player) {
    throw new Error("Player not found in room.");
  }

  const message: ChatMessage = {
    id: createId(),
    playerId,
    senderName: player.name,
    timestamp: Date.now(),
    content: content.trim(),
  };

  if (!message.content) {
    throw new Error("Message cannot be empty.");
  }

  if (room.phase === "share") {
    const existingIndex = room.chatMessages.findIndex((entry) => entry.playerId === playerId);
    if (existingIndex >= 0) {
      const nextMessages = [...room.chatMessages];
      nextMessages[existingIndex] = message;
      room.chatMessages = nextMessages;
      notify("chat_message", room, message);
      notify("room_updated", room);
      return room;
    }
  }

  room.chatMessages = [...room.chatMessages.slice(-49), message];
  notify("chat_message", room, message);
  notify("room_updated", room);
  return room;
}

export function assignNewHostIfNeeded(room: RoomState) {
  if (room.players.some((player) => player.id === room.hostPlayerId)) {
    room.players = room.players.map((player) => ({
      ...player,
      isHost: player.id === room.hostPlayerId,
    }));
    return room;
  }

  const nextHost = room.players[0];
  room.hostPlayerId = nextHost.id;
  room.players = room.players.map((player) => ({
    ...player,
    isHost: player.id === nextHost.id,
  }));
  return room;
}

function setPhase(room: RoomState, phase: Phase) {
  room.phase = phase;
  room.phaseStartedAt = Date.now();
  room.countdownSeconds = null;
  room.readyPlayers = [];
}

function recomputeActivatedPolicies(room: RoomState) {
  room.activatedPolicies = policies
    .filter((policy) => room.selectedPolicies.includes(policy.id))
    .filter((policy) => {
      const approvals = room.policyApprovals[policy.id] ?? [];
      const contributions = Object.values(room.policyContributions[policy.id] ?? {}).reduce(
        (sum, value) => sum + value,
        0,
      );
      const requirementsMet = policy.requirements.every((requirement) =>
        approvals.includes(requirement.roleId),
      );
      const funded = contributions >= getEffectivePolicyCost(policy.id, room.abilityBoosts);
      return requirementsMet && funded;
    })
    .map((policy) => policy.id);
}

function getTotalCommittedCredits(room: RoomState) {
  return Object.values(room.policyContributions).reduce(
    (roomSum, ledger) =>
      roomSum + Object.values(ledger).reduce((policySum, value) => policySum + value, 0),
    0,
  );
}

function getPlayerContributionRemaining(room: RoomState, playerId: string) {
  const player = room.players.find((entry) => entry.id === playerId);
  if (!player) return 0;
  const spent = Object.values(room.policyContributions).reduce(
    (sum, ledger) => sum + (ledger[playerId] ?? 0),
    0,
  );
  return player.contributionBudget - spent;
}

function getRoomOrThrow(roomCode: string) {
  const room = rooms.get(roomCode.toUpperCase());
  if (!room) {
    throw new Error("Room not found.");
  }
  return room;
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do {
    code = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (rooms.has(code));
  return code;
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function ensureEveryoneReady(room: RoomState) {
  const connectedPlayerIds = room.players.map((player) => player.id);
  const everyoneReady = connectedPlayerIds.every((playerId) => room.readyPlayers.includes(playerId));
  if (!everyoneReady) {
    throw new Error("Host can advance when everyone is ready.");
  }
}

function notify(event: RoomEventName, room: RoomState, payload?: unknown) {
  roomListener?.(event, room, payload);
}
