"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "../../lib/config";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for OAuth2 error parameters
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription);
          setError(errorDescription || `Authentication error: ${errorParam}`);
          setTimeout(() => router.replace('/login'), 3000);
          return;
        }

        // Verify authentication with backend
        const response = await fetch(`${config.api.backendUrl}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        if (data.authenticated) {
          router.replace('/dashboard');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => router.replace('/login'), 3000);
      }
    };

    initializeAuth();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-500 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-gray-500">Please wait while we set up your session.</p>
      </div>
    </div>
  );
}
