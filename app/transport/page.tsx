import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Suspense, lazy } from "react"
import { busScheduleData, importantNotes } from "./lib/data"
import { format } from "date-fns"
import { BellIcon, CalendarIcon, TransportNotification } from "@/components/ui/icons"

// Modern dynamic imports with concurrent loading
const BusScheduleTable = lazy(() => 
  import("./components/bus-schedule-table").then(module => ({ 
    default: module.BusScheduleTable 
  }))
)

const ImportantNotes = lazy(() => 
  import("./components/important-notes").then(module => ({ 
    default: module.ImportantNotes 
  }))
)

// Ultra-optimized skeleton components for instant rendering
const TableSkeleton = () => (
  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md min-h-[300px]" />
)

const NotesSkeleton = () => (
  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center min-h-[80px]">
    <div className="w-1.5 h-12 bg-purple-600 rounded-l-2xl mr-4" />
    <div className="flex-1 space-y-2">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
    </div>
  </div>
)

export default function TransportPage() {
  const todayLong = format(new Date(), 'd MMMM yyyy')
  
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">
        {/* Gradient Header */}
        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto mt-23">
          <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Transport Services</h1>
              <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[280px] sm:max-w-none">Access campus bus schedules and track real-time bus locations.</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Notification Settings Button */}
           
            </div>
          </div>
        </div>
        {/* Professional spacing between cards */}
        <div className="h-6" aria-hidden="true"></div>
        {/* Main Card */}
        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto z-10 mb-12">
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-0 sm:p-0 border border-gray-100 dark:border-gray-700 flex flex-col">
            {/* Table Section */}
            <div className="px-10 pt-10 pb-2 min-w-full text-sm">
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
    </DashboardLayout>
  )
}
