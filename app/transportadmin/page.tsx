'use client';

import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { BusScheduleTable } from "./components/bus-schedule-table";
import { ScheduleBusPopup } from "./components/schedule-bus-popup";
import { ImportantNotes } from "./components/important-notes";
import { useTransport } from "@/hooks/use-transport";
import type { BusScheduleCreateDto } from "@/lib/transport-api";
import type { BusSchedule } from "../transport/types";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const importantNotes = [
  "Buses depart on schedule. Please ensure schedules are updated at least 24 hours in advance.",
  "Any changes to bus schedules should be communicated to all students via announcements."
];

export default function TransportAdminPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate] = useState(new Date());
  const todayLong = format(selectedDate, 'd MMMM yyyy');
  const { schedules, loading, error, fetchSchedulesByDate, createSchedule } = useTransport({ isAdmin: true });

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

  const handleScheduleSubmit = async (scheduleData: {
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    date: Date;
  }) => {
    try {
      const createDto: BusScheduleCreateDto = {
        source: scheduleData.source,
        destination: scheduleData.destination,
        departureTime: scheduleData.departureTime,
        arrivalTime: scheduleData.arrivalTime,
        date: format(scheduleData.date, 'yyyy-MM-dd')
      };
      
      await createSchedule(createDto);
      setIsPopupOpen(false);
    } catch (err) {
      console.error('Failed to create schedule:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">
        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto mt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            SST Transport Admin Panel
          </h1>
        </div>

        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto">
          <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Schedule Management</h2>
              <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[280px] sm:max-w-none">Manage campus bus schedules and transportation services.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="ml-2">Refresh</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsPopupOpen(true)}
                disabled={loading}
                className="bg-white text-blue-600 hover:bg-white/90"
              >
                Create Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl px-2 sm:px-8 mx-auto z-10 mb-12">
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-0 sm:p-0 border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="px-10 pt-10 pb-2 min-w-full text-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">{todayLong}</h2>
                </div>
              </div>

              {error ? (
                <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <p className="font-medium">Error: {error}</p>
                </div>
              ) : (
                <BusScheduleTable schedules={transformedSchedules} loading={loading} />
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mx-10 my-2" />

            <div className="px-10 pb-10 pt-2">
              <ImportantNotes notes={importantNotes} />
            </div>
          </div>
        </div>

        {isPopupOpen && (
          <ScheduleBusPopup 
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSubmit={handleScheduleSubmit}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
