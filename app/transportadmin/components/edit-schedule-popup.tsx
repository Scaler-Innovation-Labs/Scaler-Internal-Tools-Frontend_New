"use client";

import { useEffect, useState, useRef } from 'react';
import { Modal } from "@/components/ui/modal";
import { format, parse, subMinutes, set } from 'date-fns';
import type { BusSchedule } from '../types';
import { cn } from "@/lib/utils";

// Custom Calendar Icon component
const CalendarIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.16675C12.3665 1.16693 12.666 1.46718 12.666 1.83374V2.49976H13.333C14.0663 2.49976 14.666 3.10041 14.666 3.83374V14.4998C14.666 15.2331 14.0663 15.8337 13.333 15.8337H2.66602C1.93283 15.8336 1.33301 15.233 1.33301 14.4998V3.83374C1.33301 3.10052 1.93283 2.49993 2.66602 2.49976H3.33301V1.83374C3.33301 1.46707 3.63333 1.16675 4 1.16675C4.36652 1.16693 4.66602 1.46718 4.66602 1.83374V2.49976H11.333V1.83374C11.333 1.46707 11.6333 1.16675 12 1.16675ZM2.66602 5.83374V13.8337C2.66619 14.2003 2.96645 14.4998 3.33301 14.4998H12.666C13.0326 14.4998 13.3328 14.2003 13.333 13.8337V5.83374H2.66602Z" fill="#494E50"/>
  </svg>
)

interface EditSchedulePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    date: Date;
    status: string;
    studentsBoarded?: number;
  }) => void;
  schedule: BusSchedule;
}

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' },
  { value: 'DEPARTED', label: 'Departed', color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' },
  { value: 'WAITING', label: 'Waiting', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
];

const campusOptions = [
  "Macro Campus",
  "Micro Campus 1",
  "Micro Campus 2"
];

export function EditSchedulePopup({ isOpen, onClose, onSubmit, schedule }: EditSchedulePopupProps) {
  const [error, setError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureHour: '10',
    departureMinute: '00',
    departureAmPm: 'AM',
    arrivalHour: '09',
    arrivalMinute: '55',
    arrivalAmPm: 'AM',
    date: new Date(),
    status: 'SCHEDULED' as BusSchedule['status'],
    studentsBoarded: 0
  });

  useEffect(() => {
    if (schedule) {
      try {
        // Parse the date string to Date object
        const scheduleDate = new Date(schedule.date.split('/').reverse().join('-'));
        
        // Parse departure time (format: "14:30")
        const [depHours, depMinutes] = schedule.departureTime.split(':');
        const depHour = parseInt(depHours);
        const depMinute = parseInt(depMinutes);
        const depAmPm = depHour >= 12 ? 'PM' : 'AM';
        const dep12Hour = depHour > 12 ? depHour - 12 : depHour === 0 ? 12 : depHour;

        // Parse arrival time (format: "14:25")
        const [arrHours, arrMinutes] = schedule.arrivalTime.split(':');
        const arrHour = parseInt(arrHours);
        const arrMinute = parseInt(arrMinutes);
        const arrAmPm = arrHour >= 12 ? 'PM' : 'AM';
        const arr12Hour = arrHour > 12 ? arrHour - 12 : arrHour === 0 ? 12 : arrHour;
        
        setFormData({
          source: schedule.from,
          destination: schedule.to,
          departureHour: dep12Hour.toString().padStart(2, '0'),
          departureMinute: depMinute.toString().padStart(2, '0'),
          departureAmPm: depAmPm,
          arrivalHour: arr12Hour.toString().padStart(2, '0'),
          arrivalMinute: arrMinute.toString().padStart(2, '0'),
          arrivalAmPm: arrAmPm,
          date: scheduleDate,
          status: (schedule.status || 'SCHEDULED') as BusSchedule['status'],
          studentsBoarded: schedule.studentsBoarded || 0
        });
      } catch (err) {
        console.error('Error parsing schedule times:', err);
        setError('Invalid schedule time format');
      }
    }
  }, [schedule]);

  const validateForm = () => {
    setError(null);

    if (!formData.source || !formData.destination) {
      setError("Source and destination are required");
      return false;
    }

    if (formData.source === formData.destination) {
      setError("Source and destination cannot be the same");
      return false;
    }

    const departureHour = parseInt(formData.departureHour);
    const departureMinute = parseInt(formData.departureMinute);

    if (isNaN(departureHour) || departureHour < 1 || departureHour > 12 ||
        isNaN(departureMinute) || departureMinute < 0 || departureMinute > 59) {
      setError("Invalid time format");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Convert 12-hour time to 24-hour format
    const formatTime = (hour: string, minute: string, ampm: string) => {
      const time = `${hour}:${minute} ${ampm}`;
      const parsedTime = parse(time, 'h:mm aa', new Date());
      return format(parsedTime, 'HH:mm');
    };

    try {
      const departureTime = formatTime(formData.departureHour, formData.departureMinute, formData.departureAmPm);
      const arrivalTime = formatTime(formData.arrivalHour, formData.arrivalMinute, formData.arrivalAmPm);

      onSubmit({
        source: formData.source,
        destination: formData.destination,
        departureTime,
        arrivalTime,
        date: formData.date,
        status: formData.status,
        studentsBoarded: formData.studentsBoarded
      });
    } catch (err) {
      setError("Invalid time format");
    }
  };

  const getAvailableDestinations = (source: string) => {
    if (source === "Macro Campus") {
      return campusOptions.filter(campus => campus !== "Macro Campus");
    } else {
      return ["Macro Campus"];
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    
    if (field === 'source') {
      // Reset destination when source changes
      setFormData(prev => ({
        ...prev,
        [field]: value,
        destination: '' // Reset destination to empty
      }));
    } else if (field === 'departureHour' || field === 'departureMinute' || field === 'departureAmPm') {
      // Update form data with new departure time
      const newFormData = { ...formData, [field]: value };
      
      // Calculate arrival time (5 minutes before departure)
      const time = `${newFormData.departureHour}:${newFormData.departureMinute} ${newFormData.departureAmPm}`;
      const parsedTime = parse(time, 'h:mm aa', new Date());
      const arrivalTime = subMinutes(parsedTime, 5);
      
      // Update form data with new arrival time
      setFormData({
        ...newFormData,
        arrivalHour: format(arrivalTime, 'hh'),
        arrivalMinute: format(arrivalTime, 'mm'),
        arrivalAmPm: format(arrivalTime, 'a')
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Format date as MM/DD/YYYY
  const formattedDate = format(formData.date, 'MM/dd/yyyy');

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <Modal
      id="edit-schedule"
      isOpen={isOpen}
      onClose={onClose}
      className="w-[400px] max-w-[95vw] p-0 rounded-xl overflow-hidden shadow-2xl bg-white"
    >
      {/* Header */}
      <div className="bg-blue-600 px-4 py-2">
        <h2 className="text-white font-medium text-base">Edit Schedule</h2>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <form className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Starting Stop */}
          <div className="flex items-center">
            <label className="w-[120px] text-gray-700 font-medium">Starting Stop</label>
            <div className="flex-1 flex justify-end">
              <select 
                className="border border-gray-300 rounded-md px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
              >
                <option value="">Select Starting Stop</option>
                {campusOptions.map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center">
            <label className="w-[120px] text-gray-700 font-medium">Destination</label>
            <div className="flex-1 flex justify-end">
              <select 
                className={cn(
                  "border rounded-md px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:border-transparent",
                  !formData.source && "bg-gray-100 text-gray-500 cursor-not-allowed",
                  formData.source && !formData.destination && "border-red-500 focus:ring-red-500",
                  formData.source && formData.destination && "border-gray-300 focus:ring-blue-500"
                )}
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                disabled={!formData.source}
              >
                <option value="">Select Destination</option>
                {formData.source && getAvailableDestinations(formData.source).map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Departure Time */}
          <div className="flex items-center">
            <label className="w-[120px] text-gray-700 font-medium">Departure Time</label>
            <div className="flex-1 flex justify-end">
              <div className="w-44 flex space-x-2">
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.departureHour}
                  onChange={(e) => handleInputChange("departureHour", e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, "0")}>
                      {hour.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.departureMinute}
                  onChange={(e) => handleInputChange("departureMinute", e.target.value)}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                    <option key={minute} value={minute.toString().padStart(2, "0")}>
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.departureAmPm}
                  onChange={(e) => handleInputChange("departureAmPm", e.target.value)}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Arrival Time */}
          <div className="flex items-center">
            <label className="w-[120px] text-gray-700 font-medium">Arrival Time</label>
            <div className="flex-1 flex justify-end">
              <div className="w-44 flex space-x-2">
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={formData.arrivalHour}
                  disabled
                >
                  <option>{formData.arrivalHour}</option>
                </select>
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={formData.arrivalMinute}
                  disabled
                >
                  <option>{formData.arrivalMinute}</option>
                </select>
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={formData.arrivalAmPm}
                  disabled
                >
                  <option>{formData.arrivalAmPm}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center">
            <label className="w-[120px] text-gray-700 font-medium whitespace-nowrap">Date of Departure</label>
            <div className="flex-1 flex justify-end">
              <div className="relative w-44">
                <input 
                  type="text" 
                  className="border border-gray-300 rounded-md px-3 py-1.5 w-full pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={formattedDate}
                  readOnly
                  onClick={handleCalendarClick}
                />
                <input 
                  ref={dateInputRef}
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={format(formData.date, 'yyyy-MM-dd')}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                />
                <div 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={handleCalendarClick}
                >
                  <CalendarIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <div className="grid grid-cols-3 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange("status", option.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg border transition-colors text-sm font-medium",
                    option.color,
                    formData.status === option.value ? "ring-2 ring-offset-2 ring-blue-500" : ""
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Students Boarded - Only show when status is DEPARTED */}
          {formData.status === 'DEPARTED' && (
            <div className="flex items-center">
              <label className="w-[120px] text-gray-700 font-medium">Students</label>
              <div className="flex-1 flex justify-end">
                <input
                  type="number"
                  min="0"
                  className="border border-gray-300 rounded-md px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.studentsBoarded}
                  onChange={(e) => handleInputChange("studentsBoarded", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
} 