import { ReactNode } from "react";

type ScreenContainerProps = {
  children: ReactNode;
};

export default function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <main className="soft-grid min-h-screen text-[var(--cg-ink)]">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(120,167,255,0.12),_transparent_60%)]" />
        {children}
      </div>
    </main>
  );
}
