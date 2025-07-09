"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseAuthRedirectProps {
  whenAuthenticated?: string;
  whenNotAuthenticated?: string;
}

export function useAuthRedirect({ whenAuthenticated = '/dashboard', whenNotAuthenticated = '/login' }: UseAuthRedirectProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    // Don't redirect if we're already on the target page
    if ((whenAuthenticated && pathname === whenAuthenticated) || 
        (whenNotAuthenticated && pathname === whenNotAuthenticated)) {
      console.log('Already on target page:', pathname);
      setIsChecking(false);
      return;
    }

    console.log('Checking authentication status...', {
      currentPath: pathname,
      whenAuthenticated,
      whenNotAuthenticated
    });

    try {
      console.log('Making request to verify endpoint...');
      const response = await fetch('http://localhost:8000/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log('Verify response status:', response.status);
      const data = await response.json();
      console.log('Verify response data:', data);

      if (response.ok && data.authenticated) {
        console.log('User is authenticated');
        setIsAuthenticated(true);
        
        if (whenAuthenticated && pathname !== whenAuthenticated) {
          console.log('Redirecting to:', whenAuthenticated);
          router.replace(whenAuthenticated);
        } else {
          console.log('No redirect needed for authenticated user');
        }
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
        
        if (whenNotAuthenticated && pathname !== whenNotAuthenticated) {
          console.log('Redirecting to:', whenNotAuthenticated);
          router.replace(whenNotAuthenticated);
        } else {
          console.log('No redirect needed for unauthenticated user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      
      if (whenNotAuthenticated && pathname !== whenNotAuthenticated) {
        console.log('Error occurred, redirecting to:', whenNotAuthenticated);
        router.replace(whenNotAuthenticated);
      }
    } finally {
      setIsChecking(false);
    }
  }, [router, pathname, whenAuthenticated, whenNotAuthenticated]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [checkAuth]);

  return { isChecking, isAuthenticated };
} 