import { useState, useCallback, useRef } from 'react'
import { useTransportApi } from '@/services/api/transport'
import type { BusScheduleResponseDto, BusScheduleSummaryDto, BusScheduleCreateDto, BusScheduleUpdateDto } from '@/services/api/transport'
import { format, eachDayOfInterval } from 'date-fns'

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
  const lastFetchedDateRef = useRef<string>('')
  const MIN_FETCH_INTERVAL = 1000 // Reduce to 1 second

  const fetchSchedulesByDate = useCallback(async (date: Date) => {
    const now = Date.now()
    const formattedDate = format(date, 'yyyy-MM-dd')
    
    // Always fetch if the date is different from the last fetched date
    const shouldFetch = 
      !fetchInProgressRef.current && 
      (formattedDate !== lastFetchedDateRef.current || 
       (now - lastFetchTimeRef.current) >= MIN_FETCH_INTERVAL)
    
    if (!shouldFetch) {
      return
    }
    
    try {
      fetchInProgressRef.current = true
      lastFetchTimeRef.current = now
      lastFetchedDateRef.current = formattedDate
      setLoading(true)
      setError(null)
      
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
      // Reduce the delay before allowing the next fetch
      setTimeout(() => {
        fetchInProgressRef.current = false
      }, 50)
    }
  }, [isAdmin, transportApi])

  const fetchSchedulesByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    const now = Date.now()
    const formattedStartDate = format(startDate, 'yyyy-MM-dd')
    
    // Always fetch if the date is different from the last fetched date
    const shouldFetch = 
      !fetchInProgressRef.current && 
      (formattedStartDate !== lastFetchedDateRef.current || 
       (now - lastFetchTimeRef.current) >= MIN_FETCH_INTERVAL)
    
    if (!shouldFetch) {
      return
    }
    
    try {
      fetchInProgressRef.current = true
      lastFetchTimeRef.current = now
      lastFetchedDateRef.current = formattedStartDate
      setLoading(true)
      setError(null)
      
      // Get all dates in the range
      const dates = eachDayOfInterval({ start: startDate, end: endDate })
      
      // Fetch schedules for each date
      const allSchedules = await Promise.all(
        dates.map(date => 
          isAdmin 
            ? transportApi.getAdminSchedulesByDate(format(date, 'yyyy-MM-dd'))
            : transportApi.getUserSchedulesByDate(format(date, 'yyyy-MM-dd'))
        )
      )
      
      // Flatten and process the results
      const processedResult = allSchedules
        .flat()
        .map(schedule => ({
          ...schedule,
          busStatus: schedule.busStatus?.toUpperCase() || 'SCHEDULED'
        }))
      
      setSchedules(processedResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSchedules([])
    } finally {
      setLoading(false)
      // Reduce the delay before allowing the next fetch
      setTimeout(() => {
        fetchInProgressRef.current = false
      }, 50)
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
    fetchSchedulesByDateRange,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refreshSchedules
  }
} 