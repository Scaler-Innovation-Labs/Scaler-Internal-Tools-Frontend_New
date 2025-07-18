'use client';

import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { format, addDays, subDays } from "date-fns";
import { BusScheduleTable } from "./components/bus-schedule-table";
import { ScheduleBusPopup } from "./components/schedule-bus-popup";
import { ImportantNotes } from "./components/important-notes";
import { useTransportAdmin } from "./hooks/use-transport-admin";
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
    <path d="M8 9.3H12.4444V13.3H8V9.3ZM14.2222 2.1H13.3333V0.5H11.5556V2.1H4.44444V0.5H2.66667V2.1H1.77778C0.8 2.1 0 2.82 0 3.7V14.9C0 15.78 0.8 16.5 1.77778 16.5H14.2222C15.2 16.5 16 15.78 16 14.9V3.7C16 2.82 15.2 2.1 14.2222 2.1ZM14.2222 3.7V5.3H1.77778V3.7H14.2222ZM1.77778 14.9V6.9H14.2222V14.9H1.77778Z" fill="#4D4D4D"/>
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
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const fromDateInputRef = useRef<HTMLInputElement>(null);
  const toDateInputRef = useRef<HTMLInputElement>(null);
  const { schedules, loading, error, fetchSchedulesByDateRange, createSchedule, updateSchedule, deleteSchedule } = useTransportAdmin({ isAdmin: true });

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
    fetchSchedulesByDateRange(fromDate, toDate);

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      fetchSchedulesByDateRange(fromDate, toDate);
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchSchedulesByDateRange, fromDate, toDate]);

  const handleDateChange = async (date: Date, type: 'from' | 'to') => {
    if (type === 'from') {
      setFromDate(date);
      // If from date is after to date, update to date
      if (date > toDate) {
        setToDate(date);
      }
    } else {
      setToDate(date);
      // If to date is before from date, update from date
      if (date < fromDate) {
        setFromDate(date);
      }
    }
    await fetchSchedulesByDateRange(type === 'from' ? date : fromDate, type === 'to' ? date : toDate);
  };

  const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return format(date, `d'${suffix}' MMMM yyyy`);
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
      await fetchSchedulesByDateRange(fromDate, toDate);
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
        await fetchSchedulesByDateRange(fromDate, toDate);
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
      await fetchSchedulesByDateRange(fromDate, toDate);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    }
  };

  const handleCalendarClick = () => {
    if (fromDateInputRef.current) {
      fromDateInputRef.current.showPicker();
    }
    if (toDateInputRef.current) {
      toDateInputRef.current.showPicker();
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

                {/* Date Range Picker */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="fromDate" className="text-xs font-medium text-gray-700">From:</label>
                    <div className="relative">
                      <button
                        onClick={() => fromDateInputRef.current?.showPicker()}
                        className="flex items-center gap-2 px-2 py-1 bg-[#F5F5F5] rounded-md text-xs text-gray-700 hover:bg-gray-100 font-poppins font-semibold"
                      >
                        <CustomCalendarIcon />
                        <span>{formatDateWithSuffix(fromDate)}</span>
                      </button>
                      <input
                        type="date"
                        id="fromDate"
                        ref={fromDateInputRef}
                        value={format(fromDate, 'yyyy-MM-dd')}
                        onChange={(e) => handleDateChange(new Date(e.target.value), 'from')}
                        className="sr-only"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="toDate" className="text-xs font-medium text-gray-700">To:</label>
                    <div className="relative">
                      <button
                        onClick={() => toDateInputRef.current?.showPicker()}
                        className="flex items-center gap-2 px-2 py-1 bg-[#F5F5F5] rounded-md text-xs text-gray-700 hover:bg-gray-100 font-poppins font-semibold"
                      >
                        <CustomCalendarIcon />
                        <span>{formatDateWithSuffix(toDate)}</span>
                      </button>
                      <input
                        type="date"
                        id="toDate"
                        ref={toDateInputRef}
                        value={format(toDate, 'yyyy-MM-dd')}
                        onChange={(e) => handleDateChange(new Date(e.target.value), 'to')}
                        className="sr-only"
                      />
                    </div>
                  </div>
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
          selectedDate={fromDate}
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
