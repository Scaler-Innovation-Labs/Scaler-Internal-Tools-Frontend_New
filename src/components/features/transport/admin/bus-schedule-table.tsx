"use client"

import { memo } from "react"
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import { TrashIcon } from "@heroicons/react/24/outline"
import type { BusSchedule, BusScheduleTableProps } from "@/types/features/transport-admin"
import { format, parse } from "date-fns"
import { Badge } from "@/components/ui/primitives/badge"
import { cn } from "@/lib/utils"

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.47057 4.29407H2.64705C2.21022 4.29407 1.79129 4.4676 1.48241 4.77648C1.17353 5.08536 1 5.50429 1 5.94112V13.3528C1 13.7897 1.17353 14.2086 1.48241 14.5175C1.79129 14.8264 2.21022 14.9999 2.64705 14.9999H10.0588C10.4956 14.9999 10.9145 14.8264 11.2234 14.5175C11.5323 14.2086 11.7058 13.7897 11.7058 13.3528V12.5293" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8823 2.64714L13.3529 5.11771M14.4935 3.95242C14.8178 3.62808 15.0001 3.18818 15.0001 2.72949C15.0001 2.2708 14.8178 1.8309 14.4935 1.50656C14.1692 1.18221 13.7293 1 13.2706 1C12.8119 1 12.372 1.18221 12.0476 1.50656L5.11768 8.41181V10.8824H7.58825L14.4935 3.95242Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.33301 4V2.66667C5.33301 2.31305 5.47348 1.97391 5.72353 1.72386C5.97358 1.47381 6.31272 1.33334 6.66634 1.33334H9.33301C9.68663 1.33334 10.0258 1.47381 10.2758 1.72386C10.5259 1.97391 10.6663 2.31305 10.6663 2.66667V4M12.6663 4V13.3333C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3333V4H12.6663Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66699 7.33334V11.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.33301 7.33334V11.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

type StatusType = 'SCHEDULED' | 'DEPARTED' | 'WAITING';

const statusColors = {
  SCHEDULED: "bg-[#19E7422B] text-[#319F43] dark:bg-green-900/30 dark:text-green-300",
  DEPARTED: "bg-[#E5585836] text-[#D40000] dark:bg-red-900/30 dark:text-red-300",
  WAITING: "bg-[#F891002E] text-[#FF803E] dark:bg-orange-900/30 dark:text-orange-300",
} as const;

// Helper function to format status
const formatStatus = (status: string | undefined): StatusType => {
  if (!status) return 'SCHEDULED' // Default status
  const upperStatus = status.toUpperCase() as StatusType
  return upperStatus in statusColors ? upperStatus : 'SCHEDULED'
}

// Helper function to convert 24h to 12h format
const formatTo12Hour = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  if (!hours || !minutes) return time // return original if split fails
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
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
const ScheduleRow = memo(function ScheduleRow({ schedule, index, onEdit, onDelete }: { 
  schedule: BusScheduleTableProps['schedules'][0], 
  index: number, 
  onEdit: (schedule: BusScheduleTableProps['schedules'][0]) => void, 
  onDelete: (schedule: BusScheduleTableProps['schedules'][0]) => void 
}) {
  const status = formatStatus(schedule.status)
  const parsedDate = parse(schedule.date, 'dd/MM/yyyy', new Date())
  const formattedDate = format(parsedDate, 'EEE, MMM d, yyyy')
  
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {formattedDate}
      </td>
      <td className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !text-center">
        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-lg !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {formatTo12Hour(schedule.departureTime)}
        </span>
      </td>
      <td className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.from}
      </td>
      <td className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !text-center">
        <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-lg !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {formatTo12Hour(schedule.arrivalTime)}
        </span>
      </td>
      <td className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.to}
      </td>
      <td className="w-[10%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !text-center">
        <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] ${statusColors[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </td>
      <td className="w-[10%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-semibold !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        {schedule.studentsBoarded || 0}
      </td>
      <td className="w-[5%] px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap !text-center">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => onEdit(schedule)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"

          >
            <span className="text-[#1A85FF] dark:text-blue-400">
              <EditIcon />
            </span>
          </button>
          <button 
            onClick={() => onDelete(schedule)}
            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <span className="text-red-500 dark:text-red-400">
              <TrashIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </td>
    </tr>
  )
})

// Memoize the mobile schedule card component
const MobileScheduleCard = memo(function MobileScheduleCard({ schedule, index, onEdit, onDelete }: { 
  schedule: BusScheduleTableProps['schedules'][0], 
  index: number, 
  onEdit: (schedule: BusScheduleTableProps['schedules'][0]) => void, 
  onDelete: (schedule: BusScheduleTableProps['schedules'][0]) => void 
}) {
  const status = formatStatus(schedule.status)
  const parsedDate = parse(schedule.date, 'dd/MM/yyyy', new Date())
  const formattedDate = format(parsedDate, 'EEE, MMM d, yyyy')
  
  return (
    <article
      className="bg-white dark:bg-black rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-600 w-full mx-auto mb-4"
      aria-label={`Bus schedule for ${formattedDate}`}
    >
      {/* Date Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <CalendarIcon className="w-[18px] h-[18px] text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(schedule)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-[#1A85FF] dark:text-blue-400">
              <EditIcon />
            </span>
          </button>
          <button 
            onClick={() => onDelete(schedule)}
            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <span className="text-red-500 dark:text-red-400">
              <TrashIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
      
      {/* Schedule Details */}
      <div className="space-y-4">
        {/* Departure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Departure</span>
          </div>
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {formatTo12Hour(schedule.departureTime)}
          </span>
        </div>
        
        {/* From/To */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">From</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">{schedule.from}</span>
        </div>
        
        {/* Arrival */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Arrival</span>
          </div>
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {formatTo12Hour(schedule.arrivalTime)}
          </span>
        </div>
        
        {/* To */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">To</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">{schedule.to}</span>
        </div>

        {/* Students */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Students</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
            {schedule.studentsBoarded || 0}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${statusColors[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      </div>
    </article>
  )
})

// Set display names for better debugging
EmptyState.displayName = 'EmptyState'
ScheduleRow.displayName = 'ScheduleRow'
MobileScheduleCard.displayName = 'MobileScheduleCard'

// Main table component
export const BusScheduleTable = memo(function BusScheduleTable({ 
  schedules = [], 
  loading,
  onEdit,
  onDelete 
}: { 
  schedules: BusSchedule[], 
  loading?: boolean,
  onEdit?: (schedule: BusSchedule) => void,
  onDelete?: (schedule: BusSchedule) => void
}) {
  const handleEdit = (schedule: BusSchedule) => {
    if (onEdit) onEdit(schedule)
  }

  const handleDelete = (schedule: BusSchedule) => {
    if (onDelete) onDelete(schedule)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (schedules.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>

            <tr className="bg-[#F5F5F5] dark:bg-black rounded-xl">
              <th className="first:rounded-l-xl w-[15%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">

                Date
              </th>
              <th className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                Departure
              </th>
              <th className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                From
              </th>
              <th className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                Arrival
              </th>
              <th className="w-[15%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                To
              </th>
              <th className="w-[10%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                Status
              </th>
              <th className="w-[10%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                Students
              </th>
              <th className="last:rounded-r-xl w-[5%] px-3 sm:px-4 py-3 sm:py-4 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase text-[#666666] dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
            {schedules.map((schedule, index) => (
              <ScheduleRow
                key={schedule.id}
                schedule={schedule}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {schedules.map((schedule, index) => (
          <MobileScheduleCard
            key={schedule.id}
            schedule={schedule}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  )
})