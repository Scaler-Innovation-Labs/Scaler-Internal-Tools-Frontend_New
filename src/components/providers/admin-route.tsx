"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasAdminRole } from "@/lib/utils";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { userRoles, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const adminPaths = [
    "/transportadmin",
    "/mess-admin",
    "/ticket-admin",
    "/documentadmin",
    "/common-drive-admin",
    "/fee-admin",
    "/placement-admin",
    "/room-booking-admin",
    "/gallery-admin",
    "/lost-found-admin",
    "/borrowing-admin",
    "/events-admin"
  ];

  useEffect(() => {
    if (!isLoading) {
      const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
      
      // TODO: Temporarily disabled for testing - re-enable for production
      // Allow access if user has any role (including STUDENT) for testing
      const hasAnyRole = userRoles.length > 0;
      
      // if (isAdminPath && !hasAdminRole(userRoles)) {
      if (isAdminPath && !hasAnyRole) {
        console.log('🚫 Access denied: User has no roles');
        router.replace("/dashboard");
      }
      
      // Debug: Log current roles and admin check
      console.log('Admin Route Debug:', {
        pathname,
        isAdminPath,
        userRoles,
        hasAdminRole: hasAdminRole(userRoles),
        hasAnyRole
      })
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