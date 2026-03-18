"use client";

import { useState } from "react";
import type { PlayerState, RoomState } from "@/server/roomTypes";

export default function ReflectionView({
  room,
  currentPlayer,
  onSubmit,
  onAdvance,
}: {
  room: RoomState;
  currentPlayer: PlayerState | null;
  onSubmit: (answers: { changedThinking: string; listened: string; compromise: string; nextTime: string }) => void;
  onAdvance: () => void;
}) {
  const [answers, setAnswers] = useState({
    changedThinking: currentPlayer?.reflectionAnswers?.changedThinking ?? "",
    listened: currentPlayer?.reflectionAnswers?.listened ?? "",
    compromise: currentPlayer?.reflectionAnswers?.compromise ?? "",
    nextTime: currentPlayer?.reflectionAnswers?.nextTime ?? "",
  });

  const hasSubmitted = Boolean(currentPlayer?.reflectionAnswers);
  const canSubmit = !hasSubmitted && Boolean(answers.changedThinking.trim() && answers.listened && answers.compromise.trim());

  return (
    <section className="glass-panel-strong rounded-[1.75rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">Reflection</p>
      <h1 className="mt-3 text-5xl font-semibold text-[var(--cg-ink)]">What mattered most?</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--cg-muted)]">
        Keep it short. What perspective changed your thinking, and did the group listen?
      </p>

      <label className="mt-6 block text-sm font-medium text-[var(--cg-muted)]" htmlFor="reflection-thinking">
        What information from another role changed your thinking?
      </label>
      <textarea
        id="reflection-thinking"
        value={answers.changedThinking}
        onChange={(event) =>
          setAnswers((current) => ({ ...current, changedThinking: event.target.value }))
        }
        rows={4}
        className="mt-2 w-full rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.92)] px-4 py-4 text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
        placeholder="Share one thing another role helped you see."
      />

      <label className="mt-4 block text-sm font-medium text-[var(--cg-muted)]" htmlFor="reflection-compromise">
        What did you do to meet a compromise?
      </label>
      <textarea
        id="reflection-compromise"
        value={answers.compromise}
        onChange={(event) => setAnswers((current) => ({ ...current, compromise: event.target.value }))}
        rows={3}
        className="mt-2 w-full rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(15,23,38,0.92)] px-4 py-4 text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
        placeholder="Describe one way you adjusted your position."
      />

      <p className="mt-4 text-sm font-medium text-[var(--cg-muted)]">Does this decision work for your role?</p>
      <div className="mt-2 flex flex-wrap gap-3">
        {["Yes", "Somewhat", "No"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setAnswers((current) => ({ ...current, listened: option }))}
            className={`rounded-full px-5 py-3 text-sm font-semibold ${
              answers.listened === option ? "cg-btn-primary" : "cg-btn-secondary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onSubmit(answers)}
          disabled={!canSubmit}
          className="cg-btn-primary rounded-full px-6 py-3 text-sm"
        >
          {hasSubmitted ? "Reflection submitted" : "Submit reflection"}
        </button>
        <button
          type="button"
          onClick={onAdvance}
          className="cg-btn-secondary rounded-full px-6 py-3 text-sm"
        >
          Finish for me
        </button>
        <div className="glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-muted)]">
          {Object.keys(room.reflections).length}/{room.players.length} submitted
        </div>
      </div>
      {hasSubmitted ? (
        <div className="mt-4 glass-chip rounded-full px-5 py-3 text-sm text-[var(--cg-green)]">
          Reflection saved ✓ You can finish whenever you are ready.
        </div>
      ) : null}
    </section>
  );
}
