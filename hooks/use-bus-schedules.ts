import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { config } from '@/lib/config';
import type { BusScheduleResponseDto, BusScheduleCreateDto, BusScheduleUpdateDto, BusScheduleSummaryDto } from '@/lib/transport-api';

interface UseBusSchedulesProps {
  isAdmin?: boolean;
}

interface UseTransportReturn {
  schedules: (BusScheduleResponseDto | BusScheduleSummaryDto)[];
  loading: boolean;
  error: string | null;
  fetchSchedulesByDate: (date: Date) => Promise<void>;
  fetchSchedulesByDateRange: (startDate: Date, endDate: Date) => Promise<void>;
  createSchedule: (scheduleData: BusScheduleCreateDto) => Promise<BusScheduleResponseDto>;
  updateSchedule: (id: number, scheduleData: BusScheduleUpdateDto) => Promise<BusScheduleResponseDto>;
  deleteSchedule: (id: number) => Promise<void>;
}

export function useTransport({ isAdmin = false }: UseBusSchedulesProps = {}): UseTransportReturn {
  const [schedules, setSchedules] = useState<(BusScheduleResponseDto | BusScheduleSummaryDto)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedulesByDate = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const baseUrl = isAdmin ? '/transport/schedule/admin' : '/transport/schedule/user';
      const response = await fetch(`${config.api.backendUrl}${baseUrl}/getByDate/${formattedDate}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchSchedulesByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const baseUrl = isAdmin ? '/transport/schedule/admin' : '/transport/schedule/user';
      const response = await fetch(
        `${config.api.backendUrl}${baseUrl}/getBy/date-range?start=${formattedStartDate}&end=${formattedEndDate}`,
        {
          credentials: 'include'
        }
      );
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createSchedule = useCallback(async (scheduleData: BusScheduleCreateDto) => {
    setError(null);
    try {
      const response = await fetch(`${config.api.backendUrl}/transport/schedule/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) throw new Error('Failed to create schedule');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const updateSchedule = useCallback(async (id: number, scheduleData: BusScheduleUpdateDto) => {
    setError(null);
    try {
      const response = await fetch(`${config.api.backendUrl}/transport/schedule/admin/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) throw new Error('Failed to update schedule');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const deleteSchedule = useCallback(async (id: number) => {
    setError(null);
    try {
      const response = await fetch(`${config.api.backendUrl}/transport/schedule/admin/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete schedule');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  return {
    schedules,
    loading,
    error,
    fetchSchedulesByDate,
    fetchSchedulesByDateRange,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
} 