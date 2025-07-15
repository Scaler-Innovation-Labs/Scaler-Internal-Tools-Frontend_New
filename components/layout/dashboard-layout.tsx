"use client"

import { memo, useState, Suspense, lazy, startTransition } from "react"
import { CloseIcon } from "@/components/ui/icons"
import type { DashboardLayoutProps } from "@/types"
import { AppSidebar } from "./app-sidebar"
import { useModal } from "@/contexts/modal-context"
import { cn } from "@/lib/utils"

const AppHeader = lazy(() => 
  import("./app-header").then(module => ({ 
    default: module.AppHeader 
  }))
)

const SidebarSkeleton = memo(() => (
  <div className="w-64 h-full bg-white dark:bg-black rounded-tr-3xl rounded-br-3xl">
    <div className="h-16 flex items-center px-6">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg mr-3 animate-pulse"></div>
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
    </div>
    <div className="p-3 mt-8 space-y-4">
      <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    </div>
  </div>
))

const HeaderSkeleton = memo(() => (
  <div className="h-16 flex items-center px-4">
    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded lg:hidden animate-pulse"></div>
    <div className="flex-1"></div>
    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
  </div>
))

SidebarSkeleton.displayName = 'SidebarSkeleton'
HeaderSkeleton.displayName = 'HeaderSkeleton'

export const DashboardLayout = memo(function DashboardLayout({ 
  children 
}: Omit<DashboardLayoutProps, 'activeItem'>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { isAnyModalOpen } = useModal()
  
  const handleSidebarToggle = () => {
    startTransition(() => {
      setIsSidebarOpen(prev => !prev)
    })
  }
  
  const handleSidebarClose = () => {
    startTransition(() => {
      setIsSidebarOpen(false)
    })
  }

  return (
    <div className="flex h-screen relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}
      
      {/* Content wrapper */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 w-64 transform transition-all duration-300 ease-out lg:relative lg:translate-x-0 z-30",
            "rounded-tr-3xl rounded-br-3xl overflow-hidden",
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="relative h-full bg-white dark:bg-black rounded-tr-3xl rounded-br-3xl">
            <Suspense fallback={<SidebarSkeleton />}>
              <AppSidebar onClose={handleSidebarClose} />
            </Suspense>
            
            {isSidebarOpen && (
              <button
                onClick={handleSidebarClose}
                className="absolute top-4 right-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 lg:hidden transition-all duration-200"
                aria-label="Close sidebar"
              >
                <CloseIcon size={20} />
              </button>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Suspense fallback={<HeaderSkeleton />}>
            <AppHeader onMenuClick={handleSidebarToggle} />
          </Suspense>
          
          <main className="flex-1 overflow-auto relative">
            {children}
          </main>
        </div>
      </div>

      {/* Modal overlay */}
      {isAnyModalOpen && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" />
        </div>
      )}
    </div>
  )
})

DashboardLayout.displayName = 'DashboardLayout'
