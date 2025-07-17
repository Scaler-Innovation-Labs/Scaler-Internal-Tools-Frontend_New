"use client";
import { useAuth } from "../hooks/use-auth";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/auth/login" && pathname !== "/auth/callback") {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname !== "/auth/login" && pathname !== "/auth/callback") {
    return null;
  }
  return <>{children}</>;
}
