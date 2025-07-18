"use client";
import { useAuth } from "@/hooks/auth/use-auth";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!accessToken && pathname !== "/auth/login" && pathname !== "/auth/callback") {
      router.replace("/auth/login");
    }
  }, [accessToken, pathname, router]);

  if (!accessToken && pathname !== "/auth/login" && pathname !== "/auth/callback") {
    return null;
  }
  return <>{children}</>;
}
