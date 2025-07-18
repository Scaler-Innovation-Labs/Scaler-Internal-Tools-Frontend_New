import { useState, useCallback, useRef } from 'react'
import { useTransportApi } from '@/lib/transport-api'
import type { BusScheduleResponseDto, BusScheduleSummaryDto } from '@/lib/transport-api'
import { format } from 'date-fns'

export function useTransport() {
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
      
      const result = await transportApi.getUserSchedulesByDate(formattedDate)
      
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
  }, [transportApi])

  return {
    schedules,
    loading,
    error,
    fetchSchedulesByDate
  }
} 