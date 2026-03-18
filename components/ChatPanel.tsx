"use client";

import { useState } from "react";
import type { ChatMessage } from "@/server/roomTypes";

type ChatPanelProps = {
  messages: ChatMessage[];
  onSend: (content: string) => void;
};

export default function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  return (
    <section className="glass-panel rounded-[1.5rem] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">Room Chat</p>
      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="glass-chip rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-[var(--cg-muted)]">
                <span>{message.senderName}</span>
                <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--cg-ink)]">{message.content}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/30 px-4 py-6 text-sm text-[var(--cg-muted)]">
            No messages yet. Use chat to coordinate the mission.
          </div>
        )}
      </div>
      <form
        className="mt-4 flex gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          onSend(draft);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="flex-1 rounded-full border border-[var(--cg-line)] bg-[rgba(15,23,38,0.92)] px-4 py-3 text-sm text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
          placeholder="Share what your station is seeing..."
        />
        <button
          type="submit"
          className="cg-btn-primary rounded-full px-5 py-3 text-sm"
        >
          Send
        </button>
      </form>
    </section>
  );
}
