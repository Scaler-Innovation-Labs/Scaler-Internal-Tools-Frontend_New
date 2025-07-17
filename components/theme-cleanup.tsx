'use client'

import { useEffect } from 'react'

export function ThemeCleanup({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clear any theme-related localStorage data
    localStorage.removeItem('theme')
    localStorage.removeItem('sst-transport-theme')
  }, [])

  return <>{children}</>
} 