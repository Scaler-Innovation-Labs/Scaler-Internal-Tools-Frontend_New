"use client"

import { memo } from "react"
import { CalendarIcon, ClockIcon, MapPinIcon } from "@/components/ui/icons"
import { TrashIcon } from "@heroicons/react/24/outline"
import type { BusSchedule, BusScheduleTableProps } from "../types"

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5.00012H3C2.46957 5.00012 1.96086 5.21084 1.58579 5.58591C1.21071 5.96098 1 6.46969 1 7.00012V16.0001C1 16.5306 1.21071 17.0393 1.58579 17.4143C1.96086 17.7894 2.46957 18.0001 3 18.0001H12C12.5304 18.0001 13.0391 17.7894 13.4142 17.4143C13.7893 17.0393 14 16.5306 14 16.0001V15.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 3.00011L16 6.00011M17.385 4.58511C17.7788 4.19126 18.0001 3.65709 18.0001 3.10011C18.0001 2.54312 17.7788 2.00895 17.385 1.61511C16.9912 1.22126 16.457 1 15.9 1C15.343 1 14.8088 1.22126 14.415 1.61511L6 10.0001V13.0001H9L17.385 4.58511Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
const ScheduleRow = memo(function ScheduleRow({ schedule, index, onEdit, onDelete }: { schedule: BusScheduleTableProps['schedules'][0], index: number, onEdit: (schedule: BusScheduleTableProps['schedules'][0]) => void, onDelete: (schedule: BusScheduleTableProps['schedules'][0]) => void }) {
  const status = formatStatus(schedule.status)
  
  return (
    <tr 
      key={`desktop-${index}`} 
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <td className="w-[120px] px-4 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] !text-center !align-middle text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onEdit(schedule)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-600 dark:text-gray-300">
              <EditIcon />
            </span>
          </button>
          <span>{schedule.date}</span>
        </div>
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
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full !font-[var(--font-poppins)] !font-medium !text-[14px] !leading-[100%] !tracking-[-1%] min-w-[100px] justify-center ${statusColors[status]}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
          <button 
            onClick={() => onDelete(schedule)}
            className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors ml-2"
          >
            <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </td>
    </tr>
  )
})

// Memoize the mobile schedule card component
const MobileScheduleCard = memo(function MobileScheduleCard({ schedule, index, onEdit, onDelete }: { schedule: BusScheduleTableProps['schedules'][0], index: number, onEdit: (schedule: BusScheduleTableProps['schedules'][0]) => void, onDelete: (schedule: BusScheduleTableProps['schedules'][0]) => void }) {
  const status = formatStatus(schedule.status)
  
  return (
    <article
      key={`mobile-${index}`}
      className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600 w-[95%] mx-auto"
      aria-label={`Bus schedule for ${schedule.date}`}
    >
      {/* Mobile view date header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center">
          <button 
            onClick={() => onEdit(schedule)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
          >
            <span className="text-gray-600 dark:text-gray-300">
              <EditIcon />
            </span>
          </button>
          <div className="flex items-center space-x-3">
            <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {schedule.date} • {schedule.day}
            </span>
          </div>
        </div>
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

      {/* Status Badge in mobile view */}
      <div className="flex justify-end items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium min-w-[100px] justify-center ${statusColors[status]}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
          <button 
            onClick={() => onDelete(schedule)}
            className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors ml-2"
          >
            <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
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
          <MobileScheduleCard 
            key={index} 
            schedule={schedule} 
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
              <ScheduleRow 
                key={index} 
                schedule={schedule} 
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
})