import { useState, useCallback, useRef } from 'react'
import { useTransportApi } from '@/lib/transport-api'
import type { BusScheduleResponseDto, BusScheduleSummaryDto, BusScheduleCreateDto, BusScheduleUpdateDto } from '@/lib/transport-api'
import { format } from 'date-fns'

interface UseTransportProps {
  isAdmin?: boolean
}

export function useTransport({ isAdmin = false }: UseTransportProps = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<(BusScheduleResponseDto | BusScheduleSummaryDto)[]>([])
  const transportApi = useTransportApi()
  const fetchInProgressRef = useRef(false)
  const lastFetchTimeRef = useRef<number>(0)
  const MIN_FETCH_INTERVAL = 2000 // Minimum 2 seconds between fetches

  const fetchSchedulesByDate = useCallback(async (date: Date) => {
    const now = Date.now()
    // Prevent concurrent fetches and rapid refetches
    if (fetchInProgressRef.current || (now - lastFetchTimeRef.current) < MIN_FETCH_INTERVAL) {
      return
    }
    
    try {
      fetchInProgressRef.current = true
      lastFetchTimeRef.current = now
      setLoading(true)
      setError(null)
      
      const formattedDate = format(date, 'yyyy-MM-dd')
      const result = isAdmin 
        ? await transportApi.getAdminSchedulesByDate(formattedDate)
        : await transportApi.getUserSchedulesByDate(formattedDate)
      
      // Ensure status is uppercase
      const processedResult = Array.isArray(result) 
        ? result.map(schedule => ({
            ...schedule,
            busStatus: schedule.busStatus?.toUpperCase() || 'SCHEDULED'
          }))
        : []
      
      setSchedules(processedResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSchedules([])
    } finally {
      setLoading(false)
      // Add a small delay before allowing the next fetch
      setTimeout(() => {
        fetchInProgressRef.current = false
      }, 100)
    }
  }, [isAdmin, transportApi])

  const createSchedule = useCallback(async (schedule: BusScheduleCreateDto) => {
    if (fetchInProgressRef.current) return null;
    
    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      // Create the schedule
      const result = await transportApi.createSchedule(schedule);
      
      // Immediately fetch latest schedules
      const formattedDate = format(new Date(schedule.date), 'yyyy-MM-dd');
      const updatedSchedules = await transportApi.getAdminSchedulesByDate(formattedDate);
      
      // Process and update the schedules
      const processedSchedules = Array.isArray(updatedSchedules) 
        ? updatedSchedules.map(schedule => ({
            ...schedule,
            busStatus: schedule.busStatus?.toUpperCase() || 'SCHEDULED'
          }))
        : [];
      
      setSchedules(processedSchedules);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
      // Add a small delay before allowing the next fetch
      setTimeout(() => {
        fetchInProgressRef.current = false;
      }, 100);
    }
  }, [transportApi]);

  const updateSchedule = useCallback(async (id: number, schedule: BusScheduleUpdateDto) => {
    if (fetchInProgressRef.current) return null;
    
    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      // Update the schedule
      const result = await transportApi.updateSchedule(id, schedule);
      
      // Immediately fetch latest schedules
      const formattedDate = format(new Date(schedule.date), 'yyyy-MM-dd');
      const updatedSchedules = await transportApi.getAdminSchedulesByDate(formattedDate);
      
      // Process and update the schedules
      const processedSchedules = Array.isArray(updatedSchedules) 
        ? updatedSchedules.map(schedule => ({
            ...schedule,
            busStatus: schedule.busStatus?.toUpperCase() || 'SCHEDULED'
          }))
        : [];
      
      setSchedules(processedSchedules);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [transportApi]);

  const deleteSchedule = useCallback(async (id: number) => {
    try {
      setError(null);
      
      // Delete the schedule
      await transportApi.deleteSchedule(id);
      
      // Remove the deleted schedule from state
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [transportApi]);

  // Add a new function for refreshing schedules
  const refreshSchedules = useCallback(async (date: Date) => {
    if (fetchInProgressRef.current) return;
    
    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      const updatedSchedules = await transportApi.getAdminSchedulesByDate(formattedDate);
      
      // Process and update the schedules
      const processedSchedules = Array.isArray(updatedSchedules) 
        ? updatedSchedules.map(schedule => ({
            ...schedule,
            busStatus: schedule.busStatus?.toUpperCase() || 'SCHEDULED'
          }))
        : [];
      
      setSchedules(processedSchedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setTimeout(() => {
        fetchInProgressRef.current = false;
      }, 100);
    }
  }, [transportApi]);

  return {
    schedules,
    loading,
    error,
    fetchSchedulesByDate,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refreshSchedules
  }
} 