import Link from "next/link";
import ScreenContainer from "@/components/ScreenContainer";

export default function RoomIndexPage() {
  return (
    <ScreenContainer>
      <div className="glass-panel-strong rounded-[1.75rem] p-8">
        <h1 className="text-4xl font-semibold text-[var(--cg-ink)]">Join a mission room from the landing page</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--cg-muted)]">
          Create or join a room on the main screen, then you will be routed into `/room/[roomCode]`.
        </p>
        <Link
          href="/"
          className="cg-btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm"
        >
          Back to landing
        </Link>
      </div>
    </ScreenContainer>
  );
}
