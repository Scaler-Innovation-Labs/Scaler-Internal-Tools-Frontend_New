"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './use-auth';

interface UseAuthRedirectProps {
  whenAuthenticated?: string;
  whenNotAuthenticated?: string;
}

export function useAuthRedirect({ whenAuthenticated = '/dashboard', whenNotAuthenticated = '/login' }: UseAuthRedirectProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect if we're already on the target page
    if ((whenAuthenticated && pathname === whenAuthenticated) || 
        (whenNotAuthenticated && pathname === whenNotAuthenticated)) {
      console.log('Already on target page:', pathname);
      return;
    }

    // Don't redirect while loading
    if (isLoading) {
      console.log('Auth state is loading, waiting...');
      return;
    }

    console.log('Checking authentication status...', {
      currentPath: pathname,
      whenAuthenticated,
      whenNotAuthenticated,
      isAuthenticated
    });

    if (isAuthenticated) {
      if (whenAuthenticated && pathname !== whenAuthenticated) {
        console.log('User is authenticated, redirecting to:', whenAuthenticated);
        router.replace(whenAuthenticated);
      } else {
        console.log('No redirect needed for authenticated user');
      }
    } else {
      if (whenNotAuthenticated && pathname !== whenNotAuthenticated) {
        console.log('User is not authenticated, redirecting to:', whenNotAuthenticated);
        router.replace(whenNotAuthenticated);
      } else {
        console.log('No redirect needed for unauthenticated user');
      }
    }
  }, [router, pathname, whenAuthenticated, whenNotAuthenticated, isAuthenticated, isLoading]);

  return { isLoading, isAuthenticated };
} 