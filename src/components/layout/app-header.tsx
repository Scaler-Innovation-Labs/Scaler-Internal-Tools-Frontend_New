"use client"
import { memo, useEffect, useState } from "react"
import { BellIcon, MoonIcon, SunIcon } from "@/components/ui/primitives/icons"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

import { useUser } from "@/hooks/auth/use-user"


interface AppHeaderProps {
  onMenuClick: () => void
  onNotificationClick?: () => void
}

export const AppHeader = memo(function AppHeader({ 
  onMenuClick,
  onNotificationClick 
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { userData, isLoading, fetchUserData } = useUser()

  useEffect(() => {
    setMounted(true)
    fetchUserData()
  }, [fetchUserData])


  if (!mounted) {
    return (
      <div className="flex items-center gap-5 justify-end w-full pt-6 pb-5 pr-8 bg-blue-50 dark:bg-[#161616]">
        {/* Dark Mode Toggle Placeholder */}
        <div className="w-11 h-11 bg-white rounded-full shadow" />
        {/* Other buttons placeholder */}
        <div className="w-11 h-11 bg-white rounded-full shadow" />
        <div className="w-[120px] h-11 bg-white rounded-full shadow" />
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-5 justify-end w-full pt-6 pb-5 pr-8 bg-blue-50 dark:bg-[#161616]">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full shadow",
          "bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
        )}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <SunIcon className="h-[22px] w-[22px] text-amber-500" />
        ) : (
          <MoonIcon className="h-[22px] w-[22px] text-slate-700" />
        )}
      </button>
      {/* Notification Icon */}
      <button
        onClick={onNotificationClick}
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full shadow",
          "bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
        )}
        aria-label="Notifications"
      >
        <BellIcon className="h-[22px] w-[22px]" />
      </button>
      {/* Profile */}
      <div className={cn(

        "flex flex-col items-end gap-1 rounded-full shadow px-3 py-1.5",
        "bg-white/80 dark:bg-gray-800/80"
      )}>
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {userData?.username || 'Loading...'}
        </span>
        {userData?.userRoles && (
          <div className="flex gap-1">
            {userData.userRoles.map((role, index) => (
              <span
                key={role}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                )}
              >
                {role.toLowerCase()}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  )
})

AppHeader.displayName = 'AppHeader' 