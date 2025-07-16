'use client';

import { useEffect, useCallback } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { format } from "date-fns";
import { CalendarIcon } from "@/components/ui/icons";
import { useTransport } from "@/hooks/use-transport";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { BusScheduleTable } from "./components/bus-schedule-table";
import { ImportantNotes } from "./components/important-notes";
import type { BusSchedule } from "./types";

const IMPORTANT_NOTES = [
  "Buses depart on schedule. Please arrive at the bus stop 5 minutes before departure time.",
  "Bus schedules may change during examination periods and holidays. Check announcements for updates."
];

export default function TransportPage() {
  const todayLong = format(new Date(), 'd MMMM yyyy');
  const { schedules, loading, error, fetchSchedulesByDate } = useTransport();

  // Load initial data only once when component mounts
  useEffect(() => {
    fetchSchedulesByDate(new Date());
  }, [fetchSchedulesByDate]);

  // Transform schedules to match the expected format
  const transformedSchedules: BusSchedule[] = schedules.map(s => ({
    date: format(new Date(s.date), 'dd/MM/yyyy'),
    day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' }),
    departureTime: s.departureTime,
    from: s.source,
    arrivalTime: s.arrivalTime,
    to: s.destination,
    status: s.busStatus?.toUpperCase() as BusSchedule['status'] || 'SCHEDULED'
  }));

  const handleRefresh = useCallback(async () => {
    await fetchSchedulesByDate(new Date());
  }, [fetchSchedulesByDate]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">
       

        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto">
          <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Transport Services</h2>
              <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[280px] sm:max-w-none">Access campus bus schedules and track real-time bus locations.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto z-10 mb-12">
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="px-10 py-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bus Schedule</h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-base font-medium">{todayLong}</span>
                </div>
              </div>

              {error ? (
                <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 mb-6">
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
