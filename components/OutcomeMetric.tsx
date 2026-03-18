export default function OutcomeMetric({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: number | string;
  tone?: "cyan" | "amber" | "emerald" | "rose";
}) {
  const toneClass = {
    cyan: "border-[rgba(103,135,255,0.28)] bg-[rgba(103,135,255,0.12)]",
    amber: "border-[rgba(217,164,79,0.28)] bg-[rgba(217,164,79,0.12)]",
    emerald: "border-[rgba(93,167,140,0.28)] bg-[rgba(93,167,140,0.12)]",
    rose: "border-[rgba(204,107,104,0.28)] bg-[rgba(204,107,104,0.12)]",
  }[tone];

  return (
    <article className={`rounded-[1.5rem] border p-5 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--cg-muted)]">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-[var(--cg-ink)]">{value}</p>
    </article>
  );
}
