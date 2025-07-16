"use client"

import { memo } from "react"
import { CalendarIcon, ClockIcon, MapPinIcon } from "@/components/ui/icons"
import type { BusSchedule, BusScheduleTableProps } from "../types"

type StatusType = 'SCHEDULED' | 'DEPARTED' | 'WAITING';

const statusColors = {
  SCHEDULED: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  DEPARTED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  WAITING: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
} as const;

// Helper function to format status
const formatStatus = (status: string | undefined): StatusType => {
  if (!status) return 'SCHEDULED' // Default status
  const upperStatus = status.toUpperCase() as StatusType
  return upperStatus in statusColors ? upperStatus : 'SCHEDULED'
}

// Memoize the empty state component
const EmptyState = memo(function EmptyState() {
  return (
    <div className="text-center py-12 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="text-gray-500 dark:text-gray-400 text-lg">
        No bus schedules available
      </div>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
        Click the Create button above to add a new schedule
      </p>
    </div>
  )
})

// Memoize the schedule row component
const ScheduleRow = memo(function ScheduleRow({ schedule, index }: { schedule: BusScheduleTableProps['schedules'][0], index: number }) {
  const status = formatStatus(schedule.status)
  
  return (
    <tr 
      key={`desktop-${index}`} 
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.day}
      </td>
      <td className="px-6 py-4 whitespace-nowrap !text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {schedule.departureTime}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.from}
      </td>
      <td className="px-6 py-4 whitespace-nowrap !text-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {schedule.arrivalTime}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.to}
      </td>
      <td className="px-6 py-4 whitespace-nowrap !text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] ${statusColors[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </td>
    </tr>
  )
})

// Memoize the mobile schedule card component
const MobileScheduleCard = memo(function MobileScheduleCard({ schedule, index }: { schedule: BusScheduleTableProps['schedules'][0], index: number }) {
  const status = formatStatus(schedule.status)
  
  return (
    <article
      key={`mobile-${index}`}
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
      <div className="grid grid-cols-2 gap-6">
        {/* Departure */}
        <div className="space-y-3">
          <div className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Departure
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon size={16} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-base font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {schedule.departureTime}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-base text-gray-900 dark:text-gray-100">
              {schedule.from}
            </span>
          </div>
        </div>
        
        {/* Arrival */}
        <div className="space-y-3">
          <div className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Arrival
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon size={16} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-base font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {schedule.arrivalTime}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon size={16} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-base text-gray-900 dark:text-gray-100">
              {schedule.to}
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </div>
    </article>
  )
})

// Main table component
export const BusScheduleTable = memo(function BusScheduleTable({ schedules = [], loading }: { schedules: BusSchedule[], loading?: boolean }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        Loading schedules...
      </div>
    )
  }

  if (schedules.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4" role="region" aria-label="Bus schedule mobile view">
        {schedules.map((schedule, index) => (
          <MobileScheduleCard key={index} schedule={schedule} index={index} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden" role="region" aria-label="bus schedule table">
        <table className="min-w-full" role="table">
          <thead>
            <tr className="bg-[#F5F5F5] dark:bg-black rounded-xl">
              <th className="first:rounded-l-xl px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                Date
              </th>
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                Day
              </th>
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                Departure Time
              </th>
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                From
              </th>
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                Arrival Time
              </th>
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                To
              </th>
              <th className="last:rounded-r-xl px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black">
            {schedules.map((schedule, index) => (
              <ScheduleRow 
                key={index} 
                schedule={schedule} 
                index={index} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
})