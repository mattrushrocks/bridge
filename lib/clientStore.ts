"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSocket } from "@/lib/socket";
import { ReflectionAnswers } from "@/lib/gameTypes";
import type { Phase, PlayerState, RoomState } from "@/server/roomTypes";

type ClientStoreValue = {
  room: RoomState | null;
  playerId: string | null;
  playerName: string;
  isConnected: boolean;
  errorMessage: string | null;
  currentPlayer: PlayerState | null;
  setPlayerName: (name: string) => void;
  createRoom: (name: string) => Promise<string>;
  joinRoom: (roomCode: string, name: string) => Promise<string>;
  startGame: () => void;
  advancePhase: () => void;
  toggleReady: () => void;
  selectPolicy: (policyId: string) => void;
  deselectPolicy: (policyId: string) => void;
  approveRequirement: (policyId: string) => void;
  contributePolicy: (policyId: string, delta: number) => void;
  useSpecialAbility: () => void;
  submitReflection: (answers: ReflectionAnswers) => void;
  sendChatMessage: (content: string) => void;
  clearError: () => void;
};

const STORE_KEY = "commonground-client";
const ClientStoreContext = createContext<ClientStoreValue | null>(null);

export function ClientStoreProvider({ children }: { children: React.ReactNode }) {
  const socket = getSocket();
  const [room, setRoom] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerNameState] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { playerName?: string; playerId?: string };
      if (parsed.playerName) setPlayerNameState(parsed.playerName);
      if (parsed.playerId) setPlayerId(parsed.playerId);
    } catch {}
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify({ playerName, playerId }));
  }, [playerId, playerName]);

  useEffect(() => {
    setIsConnected(socket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleRoomUpdated = (nextRoom: RoomState | null) => setRoom(nextRoom);
    const handleErrorMessage = (message: string) => setErrorMessage(message);
    const handleTimerSync = ({
      phase,
      phaseStartedAt,
      countdownSeconds,
    }: {
      phase?: Phase;
      phaseStartedAt?: number;
      countdownSeconds?: number | null;
    }) => {
      setRoom((current) =>
        current && phase
          ? { ...current, phase, phaseStartedAt: phaseStartedAt ?? current.phaseStartedAt, countdownSeconds: countdownSeconds ?? current.countdownSeconds }
          : current,
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room_updated", handleRoomUpdated);
    socket.on("error_message", handleErrorMessage);
    socket.on("timer_sync", handleTimerSync);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room_updated", handleRoomUpdated);
      socket.off("error_message", handleErrorMessage);
      socket.off("timer_sync", handleTimerSync);
    };
  }, [socket]);

  const value = useMemo<ClientStoreValue>(() => {
    const currentPlayer = room?.players.find((player) => player.id === playerId) ?? null;

    const awaitRoomEvent = (eventName: "room_created" | "room_joined") =>
      new Promise<string>((resolve, reject) => {
        const handleSuccess = (payload: { roomCode: string; playerId: string }) => {
          setPlayerId(payload.playerId);
          socket.off(eventName, handleSuccess);
          socket.off("error_message", handleError);
          resolve(payload.roomCode);
        };
        const handleError = (message: string) => {
          socket.off(eventName, handleSuccess);
          socket.off("error_message", handleError);
          reject(new Error(message));
        };

        socket.once(eventName, handleSuccess);
        socket.once("error_message", handleError);
      });

    return {
      room,
      playerId,
      playerName,
      isConnected,
      errorMessage,
      currentPlayer,
      setPlayerName: (name: string) => setPlayerNameState(name),
      createRoom: async (name: string) => {
        const trimmedName = name.trim() || "Player";
        setPlayerNameState(trimmedName);
        const pending = awaitRoomEvent("room_created");
        socket.emit("create_room", { name: trimmedName });
        return pending;
      },
      joinRoom: async (roomCode: string, name: string) => {
        const trimmedName = name.trim() || "Player";
        setPlayerNameState(trimmedName);
        const pending = awaitRoomEvent("room_joined");
        socket.emit("join_room", { roomCode: roomCode.toUpperCase(), name: trimmedName });
        return pending;
      },
      startGame: () => {
        if (room && playerId) socket.emit("start_game", { roomCode: room.roomCode, playerId });
      },
      advancePhase: () => {
        if (room && playerId) socket.emit("advance_phase", { roomCode: room.roomCode, playerId });
      },
      toggleReady: () => {
        if (room && playerId) socket.emit("toggle_ready", { roomCode: room.roomCode, playerId });
      },
      selectPolicy: (policyId: string) => {
        if (room) socket.emit("select_policy", { roomCode: room.roomCode, policyId });
      },
      deselectPolicy: (policyId: string) => {
        if (room) socket.emit("deselect_policy", { roomCode: room.roomCode, policyId });
      },
      approveRequirement: (policyId: string) => {
        if (room && playerId) {
          socket.emit("approve_requirement", { roomCode: room.roomCode, policyId, playerId });
        }
      },
      contributePolicy: (policyId: string, delta: number) => {
        if (room && playerId) {
          socket.emit("contribute_policy", { roomCode: room.roomCode, policyId, playerId, delta });
        }
      },
      useSpecialAbility: () => {
        if (room && playerId) {
          socket.emit("use_special_ability", { roomCode: room.roomCode, playerId });
        }
      },
      submitReflection: (answers: ReflectionAnswers) => {
        if (room && playerId) {
          socket.emit("submit_reflection", { roomCode: room.roomCode, playerId, answers });
        }
      },
      sendChatMessage: (content: string) => {
        if (room && playerId) {
          socket.emit("send_chat_message", { roomCode: room.roomCode, playerId, content });
        }
      },
      clearError: () => setErrorMessage(null),
    };
  }, [errorMessage, isConnected, playerId, playerName, room, socket]);

  return React.createElement(ClientStoreContext.Provider, { value }, children);
}

export function useClientStore() {
  const context = useContext(ClientStoreContext);
  if (!context) {
    throw new Error("useClientStore must be used within ClientStoreProvider.");
  }
  return context;
}
