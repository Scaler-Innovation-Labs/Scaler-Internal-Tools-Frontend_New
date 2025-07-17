'use client'

import { useEffect } from 'react'

export function CacheCleanup({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clear localStorage
    localStorage.clear()
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    // Force a hard reload if needed
    if (window.performance && window.performance.getEntriesByType) {
      const nav = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (nav && nav.type === 'back_forward') {
        window.location.reload()
      }
    }
  }, [])

  return <>{children}</>
} 