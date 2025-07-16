"use client";

import { useEffect, useState } from 'react';
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import type { BusSchedule } from '../types';
import { cn } from "@/lib/utils";

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
  }) => void;
  schedule: BusSchedule;
}

const statusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' },
  { value: 'DEPARTED', label: 'Departed', color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' },
  { value: 'WAITING', label: 'Waiting', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
];

export function EditSchedulePopup({ isOpen, onClose, onSubmit, schedule }: EditSchedulePopupProps) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    date: new Date(),
    status: 'SCHEDULED' as BusSchedule['status']
  });

  useEffect(() => {
    if (schedule) {
      // Parse the date string to Date object
      const scheduleDate = new Date(schedule.date.split('/').reverse().join('-'));
      
      setFormData({
        source: schedule.from,
        destination: schedule.to,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        date: scheduleDate,
        status: (schedule.status || 'SCHEDULED') as BusSchedule['status']
      });
    }
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      id="edit-schedule"
      isOpen={isOpen}
      onClose={onClose}
      className="w-[500px] max-w-[95vw] p-6"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Starting Stop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Stop</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Source</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option>Macro Campus</option>
                  <option>Micro Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Destination</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  <option>Micro Campus</option>
                  <option>Macro Campus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              value={format(formData.date, 'yyyy-MM-dd')}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Time</label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Time</label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              />
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
                  onClick={() => setFormData({ ...formData, status: option.value as BusSchedule['status'] })}
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
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
} 