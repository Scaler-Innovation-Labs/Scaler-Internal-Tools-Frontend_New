"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/use-auth";

export default function AuthCallback() {
  const { setAccessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL params
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          router.replace('/login?error=oauth_error');
          return;
        }
        
        if (!code) {
          console.error('No authorization code received');
          router.replace('/login?error=no_code');
          return;
        }

        // After OAuth, the backend should have set the refresh token as an HTTP-only cookie
        // We need to get a new access token using that refresh token
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        
        // Give the backend a moment to set the cookie
        setTimeout(async () => {
          const res = await fetch(`${backendUrl}/auth/refresh`, {
            method: "POST",
            credentials: "include", // This will send the HTTP-only cookie
            headers: { 
              'Content-Type': 'application/json'
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            setAccessToken(data.accessToken);
            router.replace("/dashboard");
          } else {
            console.error('Failed to refresh token:', res.status);
            router.replace("/login?error=refresh_failed");
          }
        }, 500); // 500ms delay to ensure cookie is set
        
      } catch (error) {
        console.error('Callback error:', error);
        router.replace("/login?error=callback_error");
      }
    };
    
    handleCallback();
  }, [setAccessToken, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Logging you in...</p>
      </div>
    </div>
  );
}
