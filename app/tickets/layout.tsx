import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "Ticketing System | SST Internal Tools",
  description: "Track and manage support tickets for SST campus services.",
  keywords: ["SST tickets", "support", "issue tracking", "campus services"],
  openGraph: {
    title: "Ticketing System - SST Internal Tools",
    description: "Track and manage support tickets for SST campus services.",
    type: "website",
  },
};

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
