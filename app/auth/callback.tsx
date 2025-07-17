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
          // Handle domain-specific errors
          if (errorDescription?.includes('Invalid domain')) {
            setError('Only @sst.scaler.com and @scaler.com domains are allowed');
          } else {
          setError(errorDescription || `Authentication error: ${errorParam}`);
          }
          setTimeout(() => router.replace('/login'), 3000);
          return;
        }

        // Wait a short moment to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify authentication with backend
        const response = await fetch(`${config.api.backendUrl}/auth/verify`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Try refreshing token
            const refreshResponse = await fetch(`${config.api.backendUrl}/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
              }
            });

            if (!refreshResponse.ok) {
              throw new Error('Token refresh failed');
            }

            // Retry verification after refresh
            const retryResponse = await fetch(`${config.api.backendUrl}/auth/verify`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
              }
            });

            if (!retryResponse.ok) {
              throw new Error('Authentication failed after token refresh');
            }

            const retryData = await retryResponse.json();
            if (retryData.authenticated) {
              router.replace('/dashboard');
              return;
            }
          }
          throw new Error('Authentication failed');
        }

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
