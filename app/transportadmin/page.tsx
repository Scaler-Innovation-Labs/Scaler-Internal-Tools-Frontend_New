'use client';

import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { format, addDays, subDays } from "date-fns";
import { BusScheduleTable } from "./components/bus-schedule-table";
import { ScheduleBusPopup } from "./components/schedule-bus-popup";
import { ImportantNotes } from "./components/important-notes";
import { useTransport } from "@/hooks/use-transport";
import type { BusScheduleCreateDto, BusScheduleUpdateDto } from "@/lib/transport-api";
import type { BusSchedule } from "./types";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { EditSchedulePopup } from "./components/edit-schedule-popup";

const importantNotes = [
  "Buses depart on schedule. Please ensure schedules are updated at least 24 hours in advance.",
  "Any changes to bus schedules should be communicated to all students via announcements."
];

const REFRESH_INTERVAL = config.ui.refreshIntervals.busSchedules;

// Custom Calendar Icon component
const CustomCalendarIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.16675C12.3665 1.16693 12.666 1.46718 12.666 1.83374V2.49976H13.333C14.0663 2.49976 14.666 3.10041 14.666 3.83374V14.4998C14.666 15.2331 14.0663 15.8337 13.333 15.8337H2.66602C1.93283 15.8336 1.33301 15.233 1.33301 14.4998V3.83374C1.33301 3.10052 1.93283 2.49993 2.66602 2.49976H3.33301V1.83374C3.33301 1.46707 3.63333 1.16675 4 1.16675C4.36652 1.16693 4.66602 1.46718 4.66602 1.83374V2.49976H11.333V1.83374C11.333 1.46707 11.6333 1.16675 12 1.16675ZM2.66602 5.83374V13.8337C2.66619 14.2003 2.96645 14.4998 3.33301 14.4998H12.666C13.0326 14.4998 13.3328 14.2003 13.333 13.8337V5.83374H2.66602Z" fill="#494E50"/>
  </svg>
)

// Previous Arrow Icon
const PrevArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="#494E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Next Arrow Icon
const NextArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="#494E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function TransportAdminPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { schedules, loading, error, fetchSchedulesByDate, createSchedule, updateSchedule, deleteSchedule } = useTransport({ isAdmin: true });

  // Transform schedules to match the expected format
  const transformedSchedules: BusSchedule[] = schedules.map(s => ({
    id: s.id,
    date: format(new Date(s.date), 'dd/MM/yyyy'),
    day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' }),
    departureTime: s.departureTime,
    from: s.source,
    arrivalTime: s.arrivalTime,
    to: s.destination,
    status: s.busStatus?.toUpperCase() as BusSchedule['status'] || 'SCHEDULED',
    source: s.source,
    destination: s.destination,
    dayOfWeek: s.dayOfWeek,
    busStatus: s.busStatus || 'SCHEDULED',
    studentsBoarded: s.studentsBoarded || 0
  }));

  // Load initial data and set up automatic refresh
  useEffect(() => {
    // Initial fetch
    fetchSchedulesByDate(selectedDate);

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      fetchSchedulesByDate(selectedDate);
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchSchedulesByDate, selectedDate]);

  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    try {
      await fetchSchedulesByDate(date);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handlePrevDate = async () => {
    const newDate = subDays(selectedDate, 1);
    await handleDateChange(newDate);
  };

  const handleNextDate = async () => {
    const newDate = addDays(selectedDate, 1);
    await handleDateChange(newDate);
  };

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
      
      // Create the schedule
      await createSchedule(createDto);
      setIsPopupOpen(false);
      // Immediately fetch updated schedules
      await fetchSchedulesByDate(selectedDate);
    } catch (err) {
      console.error('Failed to create schedule:', err);
    }
  };

  const handleEdit = (schedule: BusSchedule) => {
    setSelectedSchedule(schedule);
    setIsEditPopupOpen(true);
  };

  const handleDelete = async (schedule: BusSchedule) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(schedule.id);
        // Immediately fetch updated schedules
        await fetchSchedulesByDate(selectedDate);
      } catch (err) {
        console.error('Failed to delete schedule:', err);
      }
    }
  };

  const handleEditSubmit = async (scheduleData: {
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    date: Date;
    status: string;
    studentsBoarded?: number;
  }) => {
    if (!selectedSchedule) return;

    try {
      const updateDto: BusScheduleUpdateDto = {
        source: scheduleData.source,
        destination: scheduleData.destination,
        departureTime: scheduleData.departureTime,
        arrivalTime: scheduleData.arrivalTime,
        date: format(scheduleData.date, 'yyyy-MM-dd'),
        busStatus: scheduleData.status,
        studentsBoarded: scheduleData.studentsBoarded
      };
      
      // Update the schedule
      await updateSchedule(selectedSchedule.id, updateDto);
      setIsEditPopupOpen(false);
      // Immediately fetch updated schedules
      await fetchSchedulesByDate(selectedDate);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    }
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bus Schedule</h2>
                  <button
                    onClick={() => setIsPopupOpen(true)}
                    disabled={loading}
                    className="h-[30px] w-[84px] bg-[#1A85FF] hover:bg-blue-600 text-white text-sm font-semibold rounded-[12px] flex items-center justify-center"
                  >
                    + Create
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <button
                    onClick={handlePrevDate}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Previous day"
                  >
                    <PrevArrowIcon />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCalendarClick}
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <CustomCalendarIcon />
                    </button>
                    <input
                      type="date"
                      ref={dateInputRef}
                      value={format(selectedDate, 'yyyy-MM-dd')}
                      onChange={(e) => handleDateChange(new Date(e.target.value))}
                      className="sr-only"
                    />
                    <span className="text-sm sm:text-base font-medium">{format(selectedDate, 'd MMMM yyyy')}</span>
                  </div>
                  <button
                    onClick={handleNextDate}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Next day"
                  >
                    <NextArrowIcon />
                  </button>
                </div>
              </div>

              {error ? (
                <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 mb-6">
                  <p className="font-medium">Error: {error}</p>
                </div>
              ) : (
                <div className="mb-8">
                  <BusScheduleTable 
                    schedules={transformedSchedules} 
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              )}

              <div className="mt-2 pb-8">
                <ImportantNotes notes={importantNotes} />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Bus Popup */}
        <ScheduleBusPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleScheduleSubmit}
          selectedDate={selectedDate}
        />

        {/* Edit Schedule Popup */}
        {selectedSchedule && (
          <EditSchedulePopup
            isOpen={isEditPopupOpen}
            onClose={() => setIsEditPopupOpen(false)}
            onSubmit={handleEditSubmit}
            schedule={selectedSchedule}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
