"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: () => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to get cookie value
const getCookieValue = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const refreshToken = getCookieValue('refreshToken');
      if (!refreshToken) {
        setAccessToken(null);
        setError('No refresh token found. Please log in again.');
        return false;
      }
      let res;
      try {
        res = await fetch(`${backendUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
          }
        });
      } catch (fetchErr) {
        setAccessToken(null);
        setError('Network error: Failed to reach authentication server.');
        return false;
      }

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        return true;
      } else {
        setAccessToken(null);
        setError('Failed to refresh authentication. Please log in again.');
        return false;
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      setAccessToken(null);
      setError('Failed to refresh authentication');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced fetch method with automatic token handling
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const makeRequest = async (token: string) => {
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          'Authorization': `Bearer ${token}`
        }
      });
    };

    // Try with current access token
    if (accessToken) {
      const response = await makeRequest(accessToken);
      
      // If unauthorized, try to refresh token
      if (response.status === 401) {
        console.log('Access token expired, attempting refresh...');
        const refreshSuccess = await refreshSession();
        
        if (refreshSuccess && accessToken) {
          // Retry with new token
          return makeRequest(accessToken!);
        } else {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
      }
      
      return response;
    } else {
      // No access token, try refresh first
      const refreshSuccess = await refreshSession();
      if (refreshSuccess && accessToken) {
        return makeRequest(accessToken!);
      } else {
        window.location.href = '/login';
        throw new Error('No valid authentication');
      }
    }
  };

  useEffect(() => {
    // Delay the refresh to prevent hydration mismatch
    const timer = setTimeout(() => {
      refreshSession();
    }, 100);

    // Set up interval to refresh access token every 14 minutes (before 15 min expiry)
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, 14 * 60 * 1000); // 14 minutes

    return () => {
      clearTimeout(timer);
      clearInterval(refreshInterval);
    };
  }, []);

  const login = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    window.location.href = `${backendUrl}/login/oauth2/google`;
  };

  const logout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const refreshToken = getCookieValue('refreshToken');
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setAccessToken(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      accessToken, 
      setAccessToken, 
      login, 
      logout, 
      isLoading, 
      error,
      fetchWithAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
