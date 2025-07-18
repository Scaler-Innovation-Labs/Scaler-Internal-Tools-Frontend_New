import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if user has admin roles
export function hasAdminRole(userRoles: string[]): boolean {
  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'STUDENT_ADMIN'];
  return userRoles.some(role => adminRoles.includes(role));
}

// Utility function to check if user has specific role
export function hasRole(userRoles: string[], requiredRole: string): boolean {
  return userRoles.includes(requiredRole);
}

// Simple responsive utility functions
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}
