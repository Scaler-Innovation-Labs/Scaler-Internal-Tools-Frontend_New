"use client";

import { useAuthRedirect } from "../hooks/use-auth-redirect";

export default function Home() {
  // For root page, we want to redirect in both cases
  const { isChecking, isAuthenticated } = useAuthRedirect({
    whenAuthenticated: '/dashboard',
    whenNotAuthenticated: '/login'
  });

  // Show loading spinner while checking auth status
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // This should never be shown since we always redirect
  return null;
}
