"use client"

  import { CalendarIcon, ClockIcon, MapPinIcon } from "@/components/ui/icons"
import type { BusScheduleTableProps } from "../types"

const statusColors = {
  scheduled: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  departed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  waiting: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
}

export function BusScheduleTable({ schedules = [] }: BusScheduleTableProps) {
  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4" role="region" aria-label="Bus schedule mobile view">
        {schedules.map((schedule, index) => (
          <article
            key={`mobile-${index}`}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-[95%] mx-auto"
            aria-label={`Bus schedule for ${schedule.date}`}
          >
            {/* Date and Day Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
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
            <div className="grid grid-cols-2 gap-8">
              {/* Departure */}
              <div className="space-y-3">
                <div className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Departure
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon size={16} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {schedule.departureTime}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon size={16} className="text-gray-400" aria-hidden="true" />
                  <span className="text-base text-gray-600 dark:text-gray-400">
                    {schedule.from}
                  </span>
                </div>
              </div>
              
              {/* Arrival */}
              <div className="space-y-3">
                <div className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Arrival
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon size={16} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {schedule.arrivalTime}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon size={16} className="text-gray-400" aria-hidden="true" />
                  <span className="text-base text-gray-600 dark:text-gray-400">
                    {schedule.to}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-end mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[schedule.status]}`}>
                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto" role="region" aria-label="Bus schedule table">
        <table className="min-w-full" role="table">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
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
              <th className="px-6 py-3 !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle uppercase" scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {schedules.map((schedule, index) => (
              <tr 
                key={`desktop-${index}`} 
                className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle">
                  {schedule.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle">
                  {schedule.day}
                </td>
                <td className="px-6 py-4 whitespace-nowrap !text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-xl !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                    {schedule.departureTime}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle">
                  {schedule.from}
                </td>
                <td className="px-6 py-4 whitespace-nowrap !text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-xl !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                    {schedule.arrivalTime}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] !text-center !align-middle">
                  {schedule.to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap !text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full !font-[var(--font-poppins)] !font-medium !text-[13px] !leading-[100%] !tracking-[-1%] ${statusColors[schedule.status]}`}>
                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
} 