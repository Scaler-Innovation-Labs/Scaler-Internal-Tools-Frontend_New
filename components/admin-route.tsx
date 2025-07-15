"use client";

import { useAuth } from "../hooks/use-auth";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasAdminRole } from "../lib/utils";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { userRoles, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const adminPaths = ["/transportadmin"];

  useEffect(() => {
    if (!isLoading) {
      const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
      
      if (isAdminPath && !hasAdminRole(userRoles)) {
        console.log('🚫 Access denied: User does not have admin role');
        router.replace("/dashboard");
      }
    }
  }, [userRoles, pathname, router, isLoading]);

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

  // Don't render anything while redirecting
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  if (isAdminPath && !hasAdminRole(userRoles)) {
    return null;
  }

  return <>{children}</>;
} 