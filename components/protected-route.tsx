"use client";

import { useAuth } from "../hooks/use-auth";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/login", "/auth/callback"];

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !publicPaths.includes(pathname)) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting to login
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null;
  }


  return <>{children}</>;
}
