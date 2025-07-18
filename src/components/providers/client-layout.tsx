"use client";
import { AuthProvider } from "@/hooks/auth/use-auth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
