"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ScreenContainer from "@/components/ScreenContainer";
import { useClientStore } from "@/lib/clientStore";

export default function LandingPage() {
  const router = useRouter();
  const { createRoom, joinRoom, playerName, setPlayerName, errorMessage, clearError, isConnected } =
    useClientStore();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState<"create" | "join" | null>(null);

  async function handleCreate() {
    setLoading("create");
    clearError();
    try {
      const roomCode = await createRoom(playerName);
      router.push(`/room/${roomCode}`);
    } finally {
      setLoading(null);
    }
  }

  async function handleJoin() {
    setLoading("join");
    clearError();
    try {
      const roomCode = await joinRoom(joinCode, playerName);
      router.push(`/room/${roomCode}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <ScreenContainer>
      <div className="mx-auto max-w-5xl py-10">
        <div className="glass-panel-strong rounded-[2rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--cg-blue)]">
            Bridge
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)] md:text-7xl">
            Collaborative civic problem-solving through role-based interdependence.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">
            Join a 4 to 6 player session, take on a lived perspective, share unique information,
            and help your group make one hard civic decision together.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="glass-panel rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">Player Setup</p>
            <label className="mt-4 block text-sm font-medium text-[var(--cg-muted)]">
              Display name
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                className="mt-2 w-full rounded-full border border-[var(--cg-line)] bg-[rgba(15,23,38,0.92)] px-4 py-3 text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
                placeholder="Enter your name"
              />
            </label>
            <div className="glass-chip mt-4 rounded-2xl px-4 py-3 text-sm text-[var(--cg-muted)]">
              Socket status: {isConnected ? "Connected" : "Disconnected"}
            </div>
          {errorMessage ? (
              <div className="mt-4 rounded-2xl border border-[rgba(204,107,104,0.35)] bg-[rgba(204,107,104,0.14)] px-4 py-3 text-sm text-[var(--cg-red)]">
                <strong className="font-semibold">Invalid input.</strong> {errorMessage}
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <article className="glass-panel rounded-[1.75rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Create Room</p>
              <p className="mt-4 text-sm leading-6 text-[var(--cg-muted)]">
                Start a shared room and invite other players into the same civic problem.
              </p>
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading === "create" || !playerName.trim()}
                className="cg-btn-primary mt-6 rounded-full px-6 py-3 text-sm"
              >
                {loading === "create" ? "Creating..." : "Create Room"}
              </button>
            </article>

            <article className="glass-panel rounded-[1.75rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">Join Room</p>
              <label className="mt-4 block text-sm font-medium text-[var(--cg-muted)]">
                Room code
                <input
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  className="mt-2 w-full rounded-full border border-[var(--cg-line)] bg-[rgba(15,23,38,0.92)] px-4 py-3 uppercase tracking-[0.3em] text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
                  placeholder="ABCDE"
                />
              </label>
              <button
                type="button"
                onClick={handleJoin}
                disabled={loading === "join" || !playerName.trim() || !joinCode.trim()}
                className="cg-btn-primary mt-6 rounded-full px-6 py-3 text-sm"
              >
                {loading === "join" ? "Joining..." : "Join Room"}
              </button>
            </article>
          </section>
        </div>
      </div>
    </ScreenContainer>
  );
}
