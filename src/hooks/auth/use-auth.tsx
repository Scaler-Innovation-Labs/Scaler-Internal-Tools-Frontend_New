"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

import { config } from "@/lib/configs";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userRoles: string[];
  login: () => void;
  logout: () => Promise<void>;

  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshPromise, setRefreshPromise] = useState<Promise<boolean> | null>(null);
  const [lastAuthCheck, setLastAuthCheck] = useState(0);
  const [refreshDebounceTimeout, setRefreshDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    if (isRefreshing) {
      return refreshPromise!.then(() => true).catch(() => false);
    }

    try {
      setIsRefreshing(true);
      const newPromise = new Promise<boolean>(async (resolve, reject) => {
        try {
          const response = await fetch(`${config.api.backendUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            }
          });

          // If refresh token is missing or invalid, response will be 401
          if (response.status === 401) {
            setIsAuthenticated(false);
            setUserRoles([]);
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
              window.location.href = '/login';
            }
            resolve(false);
            return;
          }

          if (!response.ok) {
            setIsAuthenticated(false);
            setUserRoles([]);
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
              window.location.href = '/login';
            }
            resolve(false);
            return;
          }

          // Update last auth check time
          setLastAuthCheck(Date.now());
          resolve(true);
        } catch (error) {
          setIsAuthenticated(false);
          setUserRoles([]);
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
            window.location.href = '/login';
          }
          resolve(false);
        }
      });

      setRefreshPromise(newPromise);
      return await newPromise;
    } finally {
      setIsRefreshing(false);
      setRefreshPromise(null);
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    // Skip auth check on login and callback pages
    if (typeof window !== 'undefined' && (window.location.pathname.includes('/login') || window.location.pathname.includes('/auth/callback'))) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.api.backendUrl}/auth/verify`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.status === 401) {
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          setIsAuthenticated(false);
          setUserRoles([]);
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
            window.location.href = '/login';
          }
          return;
        }
        
        // Update last auth check time
        setLastAuthCheck(Date.now());
        setIsAuthenticated(true);
        await fetchUserData();
        return;
      }

      if (!response.ok) {
        setIsAuthenticated(false);
        setUserRoles([]);
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
          window.location.href = '/login';
        }
        return;
      }

      const data = await response.json();
      setIsAuthenticated(data.authenticated === true);
      setError(null);
      
      // Update last auth check time
      setLastAuthCheck(Date.now());
      
      // Fetch user data if authenticated
      if (data.authenticated === true) {
        await fetchUserData();
      } else {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
          window.location.href = '/login';
        }
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUserRoles([]);
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
        window.location.href = '/login';
      }

    } finally {
      setIsLoading(false);
    }
  };


  // Fetch user data including roles
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${config.api.backendUrl}/user/whoAmI`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserRoles(userData.userRoles || []);
      } else {
        setUserRoles([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUserRoles([]);
    }
  };

  // Check if token needs refresh (older than 55 minutes)
  const shouldRefreshToken = () => {
    const tokenAge = Date.now() - lastAuthCheck;
    return tokenAge > 55 * 60 * 1000; // 55 minutes
  };

  // Fetch with automatic token refresh
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Skip auth check for auth-related endpoints
    if (url.includes('/auth/') || url.includes('/login')) {
      return fetch(url, {
        ...options,
        credentials: 'include',
      });
    }

    // Clear any pending refresh check
    if (refreshDebounceTimeout) {
      clearTimeout(refreshDebounceTimeout);
      setRefreshDebounceTimeout(null);
    }

    try {
      // Make the request
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      // Handle 401 response
      if (response.status === 401) {
        const refreshSuccessful = await refreshToken();
        if (!refreshSuccessful) {
          setIsAuthenticated(false);
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }

        // Retry the original request once
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      }

      return response;
    } catch (error) {
      console.error('Error in fetchWithAuth:', error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Skip initial auth check on login and callback pages
    if (typeof window !== 'undefined' && (window.location.pathname.includes('/login') || window.location.pathname.includes('/auth/callback'))) {
      setIsLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const login = () => {
    window.location.href = `${config.api.backendUrl}/oauth2/authorization/google`;

  };

  const logout = async () => {
    try {

      await fetch(`${config.api.backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',

      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {

      setIsAuthenticated(false);
      setUserRoles([]);
      window.location.href = '/login';

    }
  };

  return (
    <AuthContext.Provider value={{ 

      isAuthenticated,
      isLoading,
      error,
      userRoles,
      login,
      logout,

      fetchWithAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;

};
