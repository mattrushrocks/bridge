import type { Metadata } from "next";
import "./globals.css";
import { ClientStoreProvider } from "@/lib/clientStore";

export const metadata: Metadata = {
  title: "Bridge",
  description: "A cooperative civic crisis simulation prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientStoreProvider>{children}</ClientStoreProvider>
      </body>
    </html>
  );
}
