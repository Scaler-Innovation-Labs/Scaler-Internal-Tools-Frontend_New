"use client";
import ClientLayout from "@/components/providers/client-layout";
import LoginPage from "@/components/features/auth/login";
import { useAuthRedirect } from "@/hooks/auth/use-auth-redirect";

export default function LoginRoute() {
  // For login page, only redirect if authenticated
  const { isLoading, isAuthenticated } = useAuthRedirect({
    whenAuthenticated: '/dashboard',
    whenNotAuthenticated: undefined // Stay on login page if not authenticated
  });

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // If we're not authenticated and not loading, show login page
  if (!isAuthenticated) {
    return (
      <ClientLayout>
        <LoginPage />
      </ClientLayout>
    );
  }

  // This should never be shown since we redirect when authenticated
  return null;

}
