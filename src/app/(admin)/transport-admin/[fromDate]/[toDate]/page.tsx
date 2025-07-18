'use client';

import { useEffect, useState, useRef, use } from 'react';
import { format, addDays, subDays, isValid, parseISO } from "date-fns";
import { BusScheduleTable } from "@/components/features/transport/admin/bus-schedule-table";
import { ScheduleBusPopup } from "@/components/features/transport/admin/schedule-bus-popup";
import { ImportantNotes } from "@/components/features/transport/admin/important-notes";
import { useTransport } from "@/hooks/api/use-transport";
import type { BusScheduleCreateDto, BusScheduleUpdateDto } from "@/services/api/transport";
import type { BusSchedule } from "@/types/features/transport-admin";
import { Button } from "@/components/ui/primitives/button";
import { config } from "@/lib/configs";
import { EditSchedulePopup } from "@/components/features/transport/admin/edit-schedule-popup";
import { notFound, useRouter } from 'next/navigation';

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

interface TransportAdminPageProps {
  params: Promise<{
    fromDate: string;
    toDate: string;
  }>;
}

export default function TransportAdminPage({ params }: TransportAdminPageProps) {
  const router = useRouter();
  
  // Unwrap the params Promise using React.use()
  const { fromDate: fromDateParam, toDate: toDateParam } = use(params);
  
  // Parse and validate the dates
  const fromDate = parseISO(fromDateParam);
  const toDate = parseISO(toDateParam);
  
  // Redirect to 404 if dates are invalid
  if (!isValid(fromDate) || !isValid(toDate)) {
    notFound();
  }

  const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return format(date, `d'${suffix}' MMMM yyyy`);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const fromDateInputRef = useRef<HTMLInputElement>(null);
  const toDateInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    schedules,
    loading,
    error,
    fetchSchedulesByDateRange,
    createSchedule,
    updateSchedule,
    deleteSchedule
  } = useTransport({ isAdmin: true });

  // Transform schedules to match the expected format
  const transformedSchedules: BusSchedule[] = schedules.map(s => ({
    id: s.id.toString(),
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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSchedulesByDateRange(fromDate, toDate);
    
    // Set up auto-refresh
    if (REFRESH_INTERVAL > 0) {
      intervalRef.current = setInterval(() => {
        fetchSchedulesByDateRange(fromDate, toDate);
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchSchedulesByDateRange, fromDateParam, toDateParam]);

  const handleDateChange = (newFromDate: Date, newToDate: Date) => {
    const fromDateString = format(newFromDate, 'yyyy-MM-dd');
    const toDateString = format(newToDate, 'yyyy-MM-dd');
    router.push(`/transport-admin/${fromDateString}/${toDateString}`);
  };

  const handleInputDateChange = (date: Date, type: 'from' | 'to') => {
    if (type === 'from') {
      // If from date is after to date, update to date
      if (date > toDate) {
        handleDateChange(date, date);
      } else {
        handleDateChange(date, toDate);
      }
    } else {
      // If to date is before from date, update from date
      if (date < fromDate) {
        handleDateChange(date, date);
      } else {
        handleDateChange(fromDate, date);
      }
    }
  };

  const navigateToPrevious = () => {
    const newFromDate = subDays(fromDate, 1);
    const newToDate = subDays(toDate, 1);
    handleDateChange(newFromDate, newToDate);
  };

  const navigateToNext = () => {
    const newFromDate = addDays(fromDate, 1);
    const newToDate = addDays(toDate, 1);
    handleDateChange(newFromDate, newToDate);
  };

  const navigateToToday = () => {
    const today = new Date();
    handleDateChange(today, today);
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    const formattedData = {
      ...scheduleData,
      date: format(scheduleData.date, 'yyyy-MM-dd')
    };
    const success = await createSchedule(formattedData);
    if (success) {
      setIsPopupOpen(false);
      // Refresh data
      await fetchSchedulesByDateRange(fromDate, toDate);
    }
  };

  const handleUpdateSchedule = async (id: string, scheduleData: any) => {
    const formattedData = {
      ...scheduleData,
      busStatus: scheduleData.status,
      date: format(scheduleData.date, 'yyyy-MM-dd')
    };
    const success = await updateSchedule(parseInt(id), formattedData);
    if (success) {
      setIsEditPopupOpen(false);
      setSelectedSchedule(null);
      // Refresh data
      await fetchSchedulesByDateRange(fromDate, toDate);
    }
  };

  const handleDeleteSchedule = async (schedule: BusSchedule) => {
    const success = await deleteSchedule(parseInt(schedule.id));
    if (success) {
      // Refresh data
      await fetchSchedulesByDateRange(fromDate, toDate);
    }
  };

  const handleEditClick = (schedule: BusSchedule) => {
    setSelectedSchedule(schedule);
    setIsEditPopupOpen(true);
  };

  const handleManualRefresh = async () => {
    await fetchSchedulesByDateRange(fromDate, toDate);
  };

  return (
  
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
                        onChange={(e) => handleInputDateChange(new Date(e.target.value), 'from')}
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
                        onChange={(e) => handleInputDateChange(new Date(e.target.value), 'to')}
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
                    onEdit={handleEditClick}
                    onDelete={handleDeleteSchedule}
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
          onSubmit={handleCreateSchedule}
          selectedDate={fromDate}
        />

        {/* Edit Schedule Popup */}
        {selectedSchedule && (
          <EditSchedulePopup
            isOpen={isEditPopupOpen}
            onClose={() => {
              setIsEditPopupOpen(false);
              setSelectedSchedule(null);
            }}
            onSubmit={(data) => handleUpdateSchedule(selectedSchedule.id, data)}
            schedule={selectedSchedule}
          />
        )}
      </div>
  
  );
}
