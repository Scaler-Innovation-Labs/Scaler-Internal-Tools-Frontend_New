"use client"

import { memo, useState, Suspense, lazy, startTransition } from "react"
import { CloseIcon } from "@/components/ui/icons"
import type { DashboardLayoutProps } from "@/types"
import { AppSidebar } from "./app-sidebar"

// Modern dynamic imports with React 18+ concurrent features
const AppHeader = lazy(() => 
  import("./app-header").then(module => ({ 
    default: module.AppHeader 
  }))
)

// Ultra-lightweight skeleton components for instant rendering
const SidebarSkeleton = memo(() => (
  <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <div className="h-16 border-b border-gray-100 dark:border-gray-700 flex items-center px-6">
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
  <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded lg:hidden animate-pulse"></div>
    <div className="flex-1"></div>
    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
  </div>
))

// Set display names for better debugging
SidebarSkeleton.displayName = 'SidebarSkeleton'
HeaderSkeleton.displayName = 'HeaderSkeleton'

export const DashboardLayout = memo(function DashboardLayout({ 
  children, 
  isBlurred = false
}: Omit<DashboardLayoutProps, 'activeItem'>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
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
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile overlay with modern backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={handleSidebarClose}
            style={{ containIntrinsicSize: '100vw 100vh' }}
          />
        )}
        
        {/* Sidebar with modern optimizations */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isBlurred ? 'blur-sm' : ''}
          `}
          style={{ contentVisibility: 'auto', containIntrinsicSize: '256px 100vh' }}
        >
          <div className="relative h-full bg-white dark:bg-gray-800">
            <Suspense fallback={<SidebarSkeleton />}>
              <AppSidebar onClose={handleSidebarClose} />
            </Suspense>
            
            {/* Mobile close button with modern interactions */}
            {isSidebarOpen && (
              <button
                onClick={handleSidebarClose}
                className="absolute top-4 right-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-all duration-200"
                aria-label="Close sidebar"
              >
                <CloseIcon size={20} />
              </button>
            )}
          </div>
        </aside>

        {/* Main content with modern layout optimizations */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
          <Suspense fallback={<HeaderSkeleton />}>
            <AppHeader onMenuClick={handleSidebarToggle} />
          </Suspense>
          
          {/* Page content with content-visibility optimization */}
          <main 
            className="flex-1 overflow-auto"
            style={{ contentVisibility: 'auto' }}
          >
              {children}
          </main>
        </div>
      </div>
    </>
  )
})

DashboardLayout.displayName = 'DashboardLayout'
