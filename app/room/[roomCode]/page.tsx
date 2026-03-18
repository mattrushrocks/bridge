"use client";

import { useParams, useRouter } from "next/navigation";
import DecisionPhaseView from "@/components/DecisionPhaseView";
import InfoView from "@/components/InfoView";
import LobbyView from "@/components/LobbyView";
import OutcomeView from "@/components/OutcomeView";
import ProgressHeader from "@/components/ProgressHeader";
import ReflectionView from "@/components/ReflectionView";
import RoleView from "@/components/RoleView";
import ScreenContainer from "@/components/ScreenContainer";
import SharePhaseView from "@/components/SharePhaseView";
import { roles } from "@/lib/gameData";
import { useClientStore } from "@/lib/clientStore";

export default function RoomPage() {
  const params = useParams<{ roomCode: string }>();
  const router = useRouter();
  const {
    room,
    currentPlayer,
    isConnected,
    errorMessage,
    clearError,
    startGame,
    advancePhase,
    toggleReady,
    selectPolicy,
    deselectPolicy,
    submitReflection,
    sendChatMessage,
  } = useClientStore();

  const roomCode = params.roomCode?.toUpperCase();

  if (!room || room.roomCode !== roomCode) {
    return (
      <ScreenContainer>
        <div className="glass-panel-strong rounded-[1.75rem] p-8">
          <h1 className="text-4xl font-semibold text-[var(--cg-ink)]">Waiting for room state</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--cg-muted)]">
            If you landed here directly, go back to the main screen and join the room first.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-full bg-[var(--cg-blue)] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to landing
          </button>
        </div>
      </ScreenContainer>
    );
  }

  const currentRole = roles.find((role) => role.id === currentPlayer?.roleId);
  const hostPlayer = room.players.find((player) => player.isHost);

  return (
    <ScreenContainer>
      <div className="space-y-4">
        <div>
          <div className="glass-panel-strong rounded-[2rem] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.14em] text-[var(--cg-blue)]">
                  Bridge Shared Room Container
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--cg-muted)]">
                  Utah housing crisis. Keep the shared problem in view, rely on each role&apos;s
                  private information, and make one group decision together.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-muted)]">
                  Room {room.roomCode}
                </div>
                <div className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-muted)]">
                  {isConnected ? "Connected" : "Reconnecting"}
                </div>
                <div className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-muted)]">
                  Host: {hostPlayer?.name ?? "Unknown"} controls progression
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--cg-muted)]">
                  Bridge
                </p>
                <h1 className="mt-2 text-4xl font-semibold text-[var(--cg-ink)]">Shared Mission Room</h1>
              </div>
              {currentRole ? (
                <div className="glass-chip max-w-xl rounded-[1.5rem] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cg-muted)]">
                    Your Role
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--cg-ink)]">{currentRole.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--cg-muted)]">
                    Your team needs your perspective to succeed. You control{" "}
                    {currentRole.approvalKey.toLowerCase()}.
                  </p>
                </div>
              ) : null}
            </div>
            <div className="mt-5">
              <ProgressHeader currentPhase={room.phase} />
            </div>
          </div>
        </div>
      </div>

      <div>
      {errorMessage ? (
        <div className="glass-panel mt-6 rounded-[1.5rem] border-[rgba(204,107,104,0.25)] px-5 py-4 text-sm text-[var(--cg-red)]">
          <div className="flex items-center justify-between gap-4">
            <span>
              <strong className="font-semibold">Invalid input.</strong> {errorMessage}
            </span>
            <button type="button" onClick={clearError} className="text-xs font-semibold uppercase tracking-[0.2em]">
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        {room.phase === "lobby" ? <LobbyView room={room} currentPlayer={currentPlayer} onStart={startGame} /> : null}
        {room.phase === "role" ? <RoleView room={room} currentPlayer={currentPlayer} onAdvance={advancePhase} /> : null}
        {room.phase === "info" ? <InfoView room={room} currentPlayer={currentPlayer} onAdvance={advancePhase} /> : null}
        {room.phase === "share" ? (
          <SharePhaseView
            room={room}
            currentPlayer={currentPlayer}
            onAdvance={advancePhase}
            onSend={sendChatMessage}
            onToggleReady={toggleReady}
          />
        ) : null}
        {room.phase === "decision" ? (
          <DecisionPhaseView
            room={room}
            currentPlayer={currentPlayer}
            errorMessage={errorMessage}
            onSelectPolicy={selectPolicy}
            onDeselectPolicy={deselectPolicy}
            onAdvance={advancePhase}
            onToggleReady={toggleReady}
          />
        ) : null}
        {room.phase === "outcome" ? (
          <OutcomeView room={room} currentPlayer={currentPlayer} onAdvance={advancePhase} onToggleReady={toggleReady} />
        ) : null}
        {room.phase === "reflection" ? (
          <ReflectionView
            room={room}
            currentPlayer={currentPlayer}
            onSubmit={submitReflection}
            onAdvance={() => router.push("/")}
          />
        ) : null}
      </div>
      </div>
    </ScreenContainer>
  );
}
