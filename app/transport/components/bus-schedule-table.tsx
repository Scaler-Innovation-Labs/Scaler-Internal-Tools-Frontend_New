import { memo } from "react"
import { CalendarIcon, ClockIcon, MapPinIcon } from "@/components/ui/icons"
import type { BusSchedule, BusScheduleTableProps } from "../types"

type StatusType = 'SCHEDULED' | 'DEPARTED' | 'WAITING'

const statusColors = {
  SCHEDULED: "bg-[#19E7422B] text-[#319F43] dark:bg-green-900/30 dark:text-green-300",
  DEPARTED: "bg-[#E5585836] text-[#D40000] dark:bg-red-900/30 dark:text-red-300",
  WAITING: "bg-[#F891002E] text-[#FF803E] dark:bg-orange-900/30 dark:text-orange-300",
} as const

// Helper function to format status
const formatStatus = (status: string | undefined): StatusType => {
  if (!status) return 'SCHEDULED' // Default status
  const upperStatus = status.toUpperCase() as StatusType
  return upperStatus in statusColors ? upperStatus : 'SCHEDULED'
}

// Memoize the empty state component
const EmptyState = memo(() => (
  <div className="text-center py-12 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-700">
    <div className="text-gray-500 dark:text-gray-400 text-lg">
      No bus schedules available for today
    </div>
    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
      Check back later for updated schedules
    </p>
  </div>
))

// Memoize the loading state component
const LoadingState = memo(() => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  </div>
))

// Memoize the schedule row component
const ScheduleRow = memo(({ schedule }: { schedule: BusScheduleTableProps['schedules'][0] }) => {
  const status = formatStatus(schedule.status)
  
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="w-[120px] px-4 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.date}
      </td>
      <td className="w-[100px] px-4 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.day}
      </td>
      <td className="w-[140px] px-4 py-4 whitespace-nowrap !text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {schedule.departureTime}
        </span>
      </td>
      <td className="w-[140px] px-4 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.from}
      </td>
      <td className="w-[140px] px-4 py-4 whitespace-nowrap !text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {schedule.arrivalTime}
        </span>
      </td>
      <td className="w-[140px] px-4 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.to}
      </td>
      <td className="w-[120px] px-4 py-4 whitespace-nowrap !text-center">
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] ${statusColors[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </td>
    </tr>
  )
})

// Memoize the mobile schedule card component
const MobileScheduleCard = memo(({ schedule }: { schedule: BusScheduleTableProps['schedules'][0] }) => {
  const status = formatStatus(schedule.status)
  
  return (
    <article
      className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600 w-[95%] mx-auto"
      aria-label={`Bus schedule for ${schedule.date}`}
    >
      {/* Date and Day Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {schedule.date}
          </span>
        </div>
        <span className="text-base font-medium text-gray-600 dark:text-gray-400">
          {schedule.day}
        </span>
      </div>
      
      {/* Schedule Details */}
      <div className="space-y-4">
        {/* Departure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Departure</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {schedule.departureTime}
          </span>
        </div>
        
        {/* From/To */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPinIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400">From</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{schedule.from}</span>
        </div>
        
        {/* Arrival */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Arrival</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {schedule.arrivalTime}
          </span>
        </div>
        
        {/* To */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPinIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400">To</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{schedule.to}</span>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </div>
    </article>
  )
})

// Set display names for better debugging
EmptyState.displayName = 'EmptyState'
LoadingState.displayName = 'LoadingState'
ScheduleRow.displayName = 'ScheduleRow'
MobileScheduleCard.displayName = 'MobileScheduleCard'

// Main table component
export const BusScheduleTable = memo(function BusScheduleTable({ schedules = [], loading = false }: { schedules: BusSchedule[], loading?: boolean }) {
  if (loading) {
    return <LoadingState />
  }

  if (schedules.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4" role="region" aria-label="Bus schedule mobile view">
        {schedules.map((schedule, index) => (
          <MobileScheduleCard key={`mobile-${index}`} schedule={schedule} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden" role="region" aria-label="bus schedule table">
        <table className="min-w-full" role="table">
          <thead>
            <tr className="bg-[#F5F5F5] dark:bg-black rounded-xl">
              <th className="first:rounded-l-xl w-[120px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                Date
              </th>
              <th className="w-[100px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                Day
              </th>
              <th className="w-[140px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                Departure Time
              </th>
              <th className="w-[140px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                From
              </th>
              <th className="w-[140px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                Arrival Time
              </th>
              <th className="w-[140px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                To
              </th>
              <th className="last:rounded-r-xl w-[120px] px-4 py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400" scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black">
            {schedules.map((schedule, index) => (
              <ScheduleRow key={`desktop-${index}`} schedule={schedule} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}) 