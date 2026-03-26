import type { Metadata } from "next";
import PersonaCompanionClient from "@/components/PersonaCompanionClient";

export const metadata: Metadata = {
  title: "Research Companion | Bridge",
  description: "A QR-ready companion page for Apple Music and Spotify persona research.",
};

export default function CompanionPage() {
  return <PersonaCompanionClient />;
}
