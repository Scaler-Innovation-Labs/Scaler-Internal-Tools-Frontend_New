"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/use-auth";

export default function AuthCallback() {
  const { setAccessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Debug info collection
        const collectDebugInfo = () => {
          const info = {
            url: window.location.href,
            protocol: window.location.protocol,
            host: window.location.host,
            cookies: document.cookie,
            searchParams: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
            headers: {
              'Content-Type': document.contentType,
              'User-Agent': window.navigator.userAgent,
            },
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            cookieEnabled: window.navigator.cookieEnabled,
          };
          console.log('Detailed Debug Info:', JSON.stringify(info, null, 2));
          setDebugInfo(JSON.stringify(info, null, 2));
        };

        // Collect initial debug info
        collectDebugInfo();

        // Check for OAuth2 error parameters
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription);
          setError(errorDescription || `Authentication error: ${errorParam}`);
          setTimeout(() => router.replace(`/login?error=${errorParam}`), 2000);
          return;
        }

        // Check for OAuth2 code and state
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (code && state) {
          console.log('OAuth2 parameters found:', { 
            code: `${code.substring(0, 5)}...`,
            state: `${state.substring(0, 5)}...`,
            fullUrl: window.location.href
          });
          
          // We're in the OAuth2 callback, redirect to backend
          const backendUrl = `http://localhost:8000/login/oauth2/code/google?code=${code}&state=${state}`;
          console.log('Redirecting to backend:', backendUrl);
          window.location.href = backendUrl;
          return;
        }

        // If we're here, we should be in the post-processing callback
        console.log('In post-processing callback');
        console.log('Current URL:', window.location.href);
        console.log('Referrer:', document.referrer);
        
        // Instead of reading cookies directly, verify auth with backend
        try {
          const response = await fetch('http://localhost:8000/api/auth/verify', {
            method: 'GET',
            credentials: 'include', // Important: This sends cookies
          });

          if (!response.ok) {
            throw new Error('Auth verification failed');
          }

          const data = await response.json();
          console.log('Auth verification successful:', data);

          // If we get here, we're authenticated
          console.log('Auth successful, proceeding to dashboard');
          router.replace('/dashboard');
        } catch (error) {
          console.error('Auth verification failed:', error);
          setError('Authentication failed - please try again');
          setTimeout(() => router.replace('/login?error=verification_failed'), 2000);
        }

      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed - unexpected error');
        setTimeout(() => router.replace('/login?error=callback_error'), 2000);
      }
    };

    initializeAuth();
  }, [setAccessToken, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 mb-4">{error}</div>
            <p className="text-gray-600 dark:text-gray-300">Redirecting to login...</p>
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-sm overflow-auto max-w-2xl mx-auto">
              {debugInfo}
            </pre>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Finalizing login...</p>
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-sm overflow-auto max-w-2xl mx-auto">
              {debugInfo}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
