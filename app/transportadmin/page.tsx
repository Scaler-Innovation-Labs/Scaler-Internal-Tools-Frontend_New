"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Suspense, lazy, useState } from "react"
import { busScheduleData, importantNotes } from "./lib/data"
import { format } from "date-fns"
import { BellIcon, CalendarIcon, TransportNotification } from "@/components/ui/icons"
import { BusScheduleTable } from "./components/bus-schedule-table"
import { ScheduleBusPopup } from "./components/schedule-bus-popup"

// Modern dynamic imports with concurrent loading
const ImportantNotes = lazy(() => 
  import("./components/important-notes").then(module => ({ 
    default: module.ImportantNotes 
  }))
)

// Ultra-optimized skeleton components for instant rendering
const TableSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md min-h-[300px]" />
)

const NotesSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md min-h-[100px]" />
)

export default function TransportAdminPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const todayLong = format(new Date(), 'd MMMM yyyy')
  
  const handleScheduleSubmit = () => {
    // Handle schedule submission
    setIsPopupOpen(false)
  }
  
  return (
    <DashboardLayout activeItem="transportadmin" isBlurred={isPopupOpen}>
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex flex-col items-center py-0">
        {/* Gradient Header */}
        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto mt-23">
          <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Transport Services Admin</h1>
              <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[280px] sm:max-w-none">Manage campus bus schedules and track real-time bus locations.</p>
            </div>
          </div>
        </div>

        {/* Professional spacing between cards */}
        <div className="h-6" aria-hidden="true"></div>

        {/* Main Card */}
        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto z-10 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-0 sm:p-0 border border-gray-100 dark:border-gray-700 flex flex-col">
            {/* Table Section */}
            <div className="px-10 pt-10 pb-2 min-w-full text-sm">
              <h2 className="!font-[var(--font-opensans)] !font-bold !text-[22px] !leading-[100%] !tracking-[0%] !align-middle mb-6">Bus Schedule</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={20} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{todayLong}</span>
                </div>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-[84px] h-[30px] rounded-xl bg-blue-600 text-white font-[var(--font-opensans)] font-semibold text-[15px] leading-[100%] tracking-[-3%] align-middle hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
              <Suspense fallback={<TableSkeleton />}>
                <BusScheduleTable schedules={busScheduleData} />
              </Suspense>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 mx-10 my-2" />

            {/* Important Note */}
            <div className="px-10 pb-10 pt-2">
              <Suspense fallback={<NotesSkeleton />}>
                <ImportantNotes notes={importantNotes} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Bus Popup */}
      <ScheduleBusPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleScheduleSubmit}
      />
    </DashboardLayout>
  )
}
