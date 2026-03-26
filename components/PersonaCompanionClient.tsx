"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { projectCompanionContent } from "@/lib/personaCompanionContent";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage: Message = {
  role: "assistant",
  content:
    "Ask about the personas, the assignment, or the journey map. This assistant is constrained to the project information stored in the app.",
};

export default function PersonaCompanionClient() {
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const publicBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;
  const companionUrl = publicBaseUrl ? `${publicBaseUrl}/companion` : "";
  const qrCodeUrl = companionUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(companionUrl)}`
    : "";

  const personaCountLabel = useMemo(
    () => `${projectCompanionContent.personas.length} personas loaded`,
    [],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextMessage = draft.trim();
    if (!nextMessage) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: nextMessage }];
    setMessages(nextMessages);
    setDraft("");
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/persona-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const payload = (await response.json()) as { error?: string; reply?: string };

      if (!response.ok || !payload.reply) {
        setError(payload.error ?? "The assistant could not answer right now.");
        return;
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.reply! }]);
    });
  }

  async function handleCopyLink() {
    if (!companionUrl) {
      return;
    }

    await navigator.clipboard.writeText(companionUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function handleStarterQuestion(question: string) {
    setDraft(question);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel-strong ambient-pulse rounded-[2rem] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--cg-blue)]">
            Research Companion
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--cg-ink)] md:text-6xl">
            Let the poster keep talking after your team walks away.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--cg-muted)] md:text-lg">
            This page gives viewers a guided way to ask about your Apple Music and Spotify personas,
            the assignment context, and the journey-map takeaways.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-ink)]">
              {personaCountLabel}
            </span>
            <span className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-ink)]">
              QR-ready landing page
            </span>
            <span className="glass-chip rounded-full px-4 py-2 text-sm text-[var(--cg-ink)]">
              OpenAI-backed chat
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(9,15,25,0.92)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--cg-muted)]">
                QR Code
              </p>
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR code for the persona companion page"
                  className="mt-4 w-full rounded-3xl bg-white p-3"
                />
              ) : (
                <div className="mt-4 rounded-3xl border border-dashed border-[var(--cg-line)] px-4 py-10 text-sm text-[var(--cg-muted)]">
                  Add `NEXT_PUBLIC_SITE_URL` so the app can generate a production QR target.
                </div>
              )}
              <div className="mt-4">
                <p className="text-sm text-[var(--cg-muted)]">
                  Target URL
                </p>
                <p className="mt-2 break-all text-sm text-[var(--cg-ink)]">
                  {companionUrl || "Set NEXT_PUBLIC_SITE_URL to your deployed site URL."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!companionUrl}
                className="cg-btn-primary mt-4 w-full rounded-full px-5 py-3 text-sm"
              >
                {copied ? "Copied" : "Copy Companion Link"}
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--cg-line)] bg-[rgba(9,15,25,0.7)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--cg-muted)]">
                What The Agent Knows
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--cg-muted)]">
                {projectCompanionContent.assignmentSummary}
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--cg-ink)]">Research scope</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--cg-muted)]">
                    {projectCompanionContent.researchScope.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--cg-ink)]">Suggested questions</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--cg-muted)]">
                    {projectCompanionContent.suggestedQuestions.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-[rgba(120,167,255,0.24)] bg-[linear-gradient(135deg,rgba(120,167,255,0.14),rgba(255,196,104,0.08))] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--cg-blue)]">
              Poster Mode
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--cg-ink)] md:text-base">
              You scanned a research companion for a student project comparing Apple Music and
              Spotify personas. Ask about the five personas, the Apple Music journey map, or the
              design insights behind the poster.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Who are the five personas in this project?",
                "What are the biggest friction points in the Apple Music journey map?",
                "How do the Spotify personas differ from the Apple Music personas?",
              ].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleStarterQuestion(question)}
                  className="cg-btn-secondary rounded-full px-4 py-2 text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-blue)]">
                Live Companion
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--cg-ink)]">
                Ask the project agent
              </h2>
            </div>
          </div>

          <div className="mt-6 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`rounded-[1.4rem] border p-4 text-sm leading-7 ${
                  message.role === "assistant"
                    ? "border-[var(--cg-line)] bg-[rgba(10,16,26,0.9)] text-[var(--cg-ink)]"
                    : "border-[rgba(120,167,255,0.28)] bg-[rgba(120,167,255,0.14)] text-[var(--cg-ink)]"
                }`}
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--cg-muted)]">
                  {message.role === "assistant" ? "Companion" : "You"}
                </p>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </article>
            ))}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-[rgba(204,107,104,0.35)] bg-[rgba(204,107,104,0.14)] px-4 py-3 text-sm text-[var(--cg-red)]">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5">
            <label className="block text-sm font-medium text-[var(--cg-muted)]">
              Ask a question
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                placeholder="Ask about a persona, a friction point, or what this poster is trying to show."
                className="mt-2 w-full rounded-[1.4rem] border border-[var(--cg-line)] bg-[rgba(10,16,26,0.95)] px-4 py-3 text-[var(--cg-ink)] outline-none focus:border-[var(--cg-blue)]"
              />
            </label>
            <button
              type="submit"
              disabled={isPending || !draft.trim()}
              className="cg-btn-primary mt-4 w-full rounded-full px-6 py-3 text-sm"
            >
              {isPending ? "Thinking..." : "Send To Companion"}
            </button>
          </form>
        </section>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">
            Personas In Scope
          </p>
          <div className="mt-4 grid gap-4">
            {projectCompanionContent.personas.map((persona) => (
              <div
                key={persona.id}
                className="rounded-[1.3rem] border border-[var(--cg-line)] bg-[rgba(8,14,23,0.82)] p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-[var(--cg-ink)]">{persona.name}</h3>
                  <span className="rounded-full bg-[rgba(120,167,255,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cg-blue)]">
                    {persona.platform}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--cg-muted)]">{persona.summary}</p>
                <p className="mt-3 text-sm text-[var(--cg-ink)]">
                  <span className="font-semibold">Archetype:</span> {persona.archetype}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--cg-muted)]">
            Before You Print
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--cg-muted)]">
            <li>• Replace the placeholder persona text in `lib/personaCompanionContent.ts` with your real research.</li>
            <li>• Add `OPENAI_API_KEY` so the chat route can call the model.</li>
            <li>• Add `NEXT_PUBLIC_SITE_URL` to the deployed URL that your QR code should open.</li>
            <li>• Deploy the app, open `/companion`, and test a few real questions before you export the poster QR.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
