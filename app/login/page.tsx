"use client";
import ClientLayout from "../client-layout";
import LoginPage from "../auth/login";
import { useAuth } from "../../hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

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

  // If we're not authenticated and not checking, show login page
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
