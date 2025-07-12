"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { config } from "../lib/config";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshPromise, setRefreshPromise] = useState<Promise<boolean> | null>(null);

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    if (isRefreshing) {
      console.log('🔄 Already refreshing, waiting for existing refresh to complete...');
      return refreshPromise!.then(() => true).catch(() => false);
    }

    try {
      console.log('🔄 Starting token refresh...');
      setIsRefreshing(true);
      const newPromise = new Promise<boolean>(async (resolve, reject) => {
        try {
          console.log('📤 Making refresh request to:', `${config.api.backendUrl}/auth/refresh`);
          const response = await fetch(`${config.api.backendUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            }
          });

          // Log response headers
          console.log('📥 Refresh response status:', response.status);
          console.log('📥 Refresh response headers:', {
            'content-type': response.headers.get('content-type'),
            'set-cookie': response.headers.get('set-cookie')
          });

          // Get the response body
          const text = await response.text();
          console.log('📥 Refresh response body:', text);

          if (!response.ok) {
            if (response.status === 400 || response.status === 401) {
              console.log('❌ Refresh token is invalid or missing');
              throw new Error('Invalid refresh token');
            }
            throw new Error(`Token refresh failed: ${text}`);
          }

          // Log cookies after refresh
          console.log('🍪 Current cookies:', document.cookie);

          // Wait a moment for cookies to be set
          console.log('⏳ Waiting for cookies to be set...');
          await new Promise(resolve => setTimeout(resolve, 100));

          // Log cookies after waiting
          console.log('🍪 Cookies after waiting:', document.cookie);

          // Verify the new tokens work
          console.log('🔍 Verifying new tokens...');
          const verifyResponse = await fetch(`${config.api.backendUrl}/api/auth/verify`, {
            method: 'GET',
            credentials: 'include',
          });

          console.log('📥 Verify response status:', verifyResponse.status);
          const verifyData = await verifyResponse.json();
          console.log('📥 Verify response data:', verifyData);

          if (!verifyResponse.ok || !verifyData.authenticated) {
            console.log('❌ New tokens verification failed');
            throw new Error('Token verification failed after refresh');
          }

          console.log('✅ Token refresh successful and verified');
          resolve(true);
        } catch (error) {
          console.error('❌ Token refresh error:', error);
          setIsAuthenticated(false);
          reject(error);
        }
      });

      setRefreshPromise(newPromise);
      return await newPromise;
    } finally {
      console.log('🔄 Refresh process complete');
      setIsRefreshing(false);
      setRefreshPromise(null);
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      console.log('🔍 Checking auth status...');
      const response = await fetch(`${config.api.backendUrl}/api/auth/verify`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log('📥 Auth check response status:', response.status);
      
      if (response.status === 401) {
        console.log('🔄 Auth check returned 401, attempting token refresh...');
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          console.log('❌ Token refresh failed during auth check');
          setIsAuthenticated(false);
          setError('Authentication failed');
          return;
        }
        // Verify auth again after refresh
        console.log('🔍 Verifying auth after refresh...');
        const retryResponse = await fetch(`${config.api.backendUrl}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!retryResponse.ok) {
          console.log('❌ Auth verification failed after refresh');
          setIsAuthenticated(false);
          setError('Authentication failed');
          return;
        }

        const retryData = await retryResponse.json();
        console.log('📥 Retry verify response:', retryData);
        setIsAuthenticated(retryData.authenticated === true);
        setError(null);
        return;
      }

      if (!response.ok) {
        console.log('❌ Auth check failed with status:', response.status);
        setIsAuthenticated(false);
        setError('Authentication check failed');
        return;
      }

      const data = await response.json();
      console.log('📥 Auth check response:', data);
      setIsAuthenticated(data.authenticated === true);
      setError(null);
    } catch (err) {
      console.error('❌ Auth check failed:', err);
      setIsAuthenticated(false);
      setError('Authentication check failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch with automatic token refresh
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const fetchWithRetry = async (): Promise<Response> => {
      console.log('📤 Making authenticated request to:', url);
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      console.log('📥 Response status:', response.status);

      if (response.status === 401) {
        console.log('🔄 Request returned 401, attempting token refresh...');
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          console.log('❌ Token refresh failed, redirecting to login...');
          setIsAuthenticated(false);
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
        // Retry the original request
        console.log('🔄 Retrying original request after refresh');
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      }

      return response;
    };

    try {
      return await fetchWithRetry();
    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 Initializing auth state...');
    checkAuth();

    // Check auth status every minute
    const interval = setInterval(() => {
      console.log('⏰ Running periodic auth check...');
      checkAuth();
    }, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const login = () => {
    console.log('🔀 Redirecting to Google OAuth...');
    window.location.href = `${config.api.backendUrl}/oauth2/authorization/google`;
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch(`${config.api.backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('❌ Logout failed:', err);
    } finally {
      setIsAuthenticated(false);
      console.log('🔀 Redirecting to login after logout...');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      fetchWithAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
