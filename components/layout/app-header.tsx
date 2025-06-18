"use client"
import { memo } from "react"
import { BellIcon, MoonIcon, SunIcon } from "@/components/ui/icons"
import { useTheme } from "next-themes"

interface AppHeaderProps {
  onMenuClick: () => void
  onNotificationClick?: () => void
}

export const AppHeader = memo(function AppHeader({ 
  onMenuClick,
  onNotificationClick 
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="flex items-center gap-5 justify-end w-full pt-6 pb-5 pr-8">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow transition-all hover:bg-blue-50 dark:hover:bg-gray-700"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <SunIcon size={22} /> : <MoonIcon size={22} />}
      </button>
      {/* Notification Icon */}
      <button
        onClick={onNotificationClick}
        className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow transition-all hover:bg-blue-50 dark:hover:bg-gray-700"
        aria-label="Notifications"
      >
        <BellIcon size={22} />
      </button>
      {/* Profile */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow px-3 py-1.5">
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Adeola Ayo</span>
      </div>
    </div>
  )
})

AppHeader.displayName = 'AppHeader' 