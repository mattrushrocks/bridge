"use client";

import { useMemo, useState } from "react";
import { roles } from "@/lib/gameData";
import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function SharePhaseView({
  room,
  currentPlayer,
  onAdvance,
  onSend,
  onToggleReady,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onAdvance: () => void;
  onSend: (content: string) => void;
  onToggleReady: () => void;
}) {
  const role = roles.find((entry) => entry.id === currentPlayer?.roleId);
  const myMessage = useMemo(
    () => (currentPlayer ? room.chatMessages.find((message) => message.playerId === currentPlayer.id) : null),
    [currentPlayer, room.chatMessages],
  );
  const [draft, setDraft] = useState("");
  const distinctContributors = new Set(room.chatMessages.map((message) => message.playerId)).size;
  const isReady = Boolean(currentPlayer && room.readyPlayers.includes(currentPlayer.id));
  const quickOptions = role
    ? [
        `${role.priority} matters most to my role.`,
        role.goal,
        role.privateInfo[0],
      ]
    : [];

  return (
    <section className="glass-panel-strong rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Share</p>
      <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">What matters most to your role?</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">
        Discuss together, then confirm when your group is ready.
      </p>

      {role ? (
        <div className="mt-6 rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.88)] p-5">
          <p className="text-sm font-semibold text-[var(--cg-blue)]">{role.name}</p>
          <p className="mt-3 text-sm font-medium text-[var(--cg-ink)]">Priority: {role.priority}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--cg-muted)]">Goal: {role.goal}</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--cg-ink)]">
            {role.privateInfo.map((item) => (
              <li key={item} className="glass-chip rounded-2xl px-3 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const content = draft.trim() || myMessage?.content || "";
          if (!content) return;
          onSend(content);
          setDraft("");
        }}
      >
        {quickOptions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--cg-muted)]">Choose one, or type your own:</p>
            <div className="flex flex-col gap-3">
              {quickOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDraft(option)}
                  className="cg-btn-secondary rounded-2xl px-4 py-4 text-left text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <label className="block text-sm font-medium text-[var(--cg-muted)]" htmlFor="share-response">
          What matters most to your role?
        </label>
        <textarea
          id="share-response"
          value={draft || myMessage?.content || ""}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="w-full rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.92)] px-4 py-4 text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
          placeholder="Type one short concern or priority..."
        />
        <button
          type="submit"
          disabled={!(draft.trim() || myMessage?.content)}
          className="cg-btn-primary rounded-full px-6 py-3 text-sm"
        >
          {myMessage ? "Edit response" : "Save response"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-green)]">
          {myMessage ? "Response saved ✓" : "Waiting for your response..."}
        </div>
        <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-muted)]">
          {room.readyPlayers.length} of {room.players.length} players ready
        </div>
        <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-muted)]">
          {distinctContributors}/{Math.min(room.players.length, 2)} players have shared
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {room.chatMessages.map((message) => (
          <div key={message.id} className="glass-chip rounded-2xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cg-muted)]">
              {message.senderName}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--cg-ink)]">{message.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onToggleReady}
          className="cg-btn-primary rounded-full px-6 py-3 text-sm"
        >
          {isReady ? "Edit response" : "I am ready"}
        </button>
        <button
          type="button"
          disabled={!currentPlayer?.isHost || distinctContributors < 2 || room.readyPlayers.length !== room.players.length}
          onClick={onAdvance}
          className="cg-btn-primary rounded-full px-6 py-3 text-sm"
        >
          {currentPlayer?.isHost ? "Advance when everyone is ready" : "Waiting for host"}
        </button>
      </div>
    </section>
  );
}
