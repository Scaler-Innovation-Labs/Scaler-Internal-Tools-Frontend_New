'use client';

import { useEffect, useCallback, useState } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { format, addDays } from "date-fns";
import { useTransport } from "@/hooks/use-transport";
import { BusScheduleTable } from "./components/bus-schedule-table";
import { ImportantNotes } from "./components/important-notes";
import type { BusSchedule } from "./types";
import { cn } from "@/lib/utils";

const IMPORTANT_NOTES = [
  "Buses depart on schedule. Please arrive at the bus stop 5 minutes before departure time.",
  "Bus schedules may change during examination periods and holidays. Check announcements for updates."
];

export default function TransportPage() {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const { schedules, loading, error, fetchSchedulesByDate } = useTransport();

  // Get current date and tomorrow's date
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const selectedDate = selectedDay === 'today' ? today : tomorrow;

  useEffect(() => {
    fetchSchedulesByDate(selectedDate);
  }, [fetchSchedulesByDate, selectedDate]);

  const transformedSchedules: BusSchedule[] = schedules.map(s => ({
    date: format(new Date(s.date), 'dd/MM/yyyy'),
    day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' }),
    departureTime: s.departureTime, // Pass raw time
    from: s.source,
    arrivalTime: s.arrivalTime, // Pass raw time
    to: s.destination,
    status: s.busStatus?.toUpperCase() as BusSchedule['status'] || 'SCHEDULED'
  }));

  const handleRefresh = useCallback(async () => {
    await fetchSchedulesByDate(selectedDate);
  }, [fetchSchedulesByDate, selectedDate]);


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">

        <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto">
          <div className="h-auto min-h-[120px] sm:min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-8 lg:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Transport Services</h2>
              <p className="text-sm sm:text-base lg:text-lg text-slate-100 font-normal">Access campus bus schedules and track real-time bus locations.</p>
            </div>
          </div>
        </div>


        <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto z-10 mb-12">
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bus Schedule</h2>
              </div>

              {/* Day Toggle Buttons */}
              <div className="flex flex-col sm:flex-row items-start justify-start gap-2 sm:gap-4 mb-2">
                <button
                  onClick={() => setSelectedDay('today')}
                  className={cn(
                    "w-full sm:w-32 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors shadow-sm",
                    selectedDay === 'today'
                      ? "bg-[#2E4CEE] text-white hover:bg-[#2E4CEE]/90"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  )}
                  aria-pressed={selectedDay === 'today'}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDay('tomorrow')}
                  className={cn(
                    "w-full sm:w-32 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors shadow-sm",
                    selectedDay === 'tomorrow'
                      ? "bg-[#2E4CEE] text-white hover:bg-[#2E4CEE]/90"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  )}
                  aria-pressed={selectedDay === 'tomorrow'}
                >
                  Tomorrow
                </button>
              </div>

              {error ? (
                <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 mb-4">
                  <p className="font-medium">Error: {error}</p>
                </div>
              ) : (
                <div className="mb-8">
                  <BusScheduleTable schedules={transformedSchedules} loading={loading} />
                </div>
              )}

              <div className="mt-2 pb-8">
                <ImportantNotes notes={IMPORTANT_NOTES} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
