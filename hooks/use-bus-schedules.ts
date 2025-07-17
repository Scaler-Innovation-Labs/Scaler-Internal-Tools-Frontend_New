import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Types for the API response
export interface BusSchedule {
  source: string
  destination: string
  departureTime: string // "08:00:00"
  arrivalTime: string   // "09:00:00"
  dayofWeek: string    // "MONDAY"
  date: string         // "2024-06-01"
  busStatus: 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'COMPLETED'
}

// Frontend display types
export interface DisplayBusSchedule {
  id: string
  from: string
  to: string
  departureTime: string // "08:00 AM"
  arrivalTime: string   // "09:00 AM"
  day: string          // "Monday"
  date: string         // "June 1, 2024"
  busStatus: string
  statusColor: string
}

interface BusScheduleState {
  schedules: BusSchedule[]
  displaySchedules: DisplayBusSchedule[]
  loading: boolean
  error: string | null
  selectedDate: string
  
  // Actions
  fetchSchedulesByDate: (date: string) => Promise<void>
  setSelectedDate: (date: string) => void
  clearError: () => void
}

// Get API base URL with fallback
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
}

// Utility functions for formatting
const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':')
    if (!hours || !minutes) return time
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  } catch {
    return time
  }
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

const formatDay = (dayString: string): string => {
  return dayString.charAt(0).toUpperCase() + dayString.slice(1).toLowerCase()
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'SCHEDULED':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200'
    case 'DELAYED':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-200'
    case 'CANCELLED':
      return 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-200'
    case 'COMPLETED':
      return 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-200'
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/50 dark:text-gray-200'
  }
}

const transformSchedulesForDisplay = (schedules: BusSchedule[]): DisplayBusSchedule[] => {
  return schedules.map((schedule, index) => ({
    id: `${schedule.date}-${schedule.departureTime}-${index}`,
    from: schedule.source,
    to: schedule.destination,
    departureTime: formatTime(schedule.departureTime),
    arrivalTime: formatTime(schedule.arrivalTime),
    day: formatDay(schedule.dayofWeek),
    date: formatDate(schedule.date),
    busStatus: formatDay(schedule.busStatus),
    statusColor: getStatusColor(schedule.busStatus)
  }))
}

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0] || ''
}

export const useBusSchedules = create<BusScheduleState>()(
  devtools(
    (set) => ({
      schedules: [],
      displaySchedules: [],
      loading: false,
      error: null,
      selectedDate: getTodayDate(),

      fetchSchedulesByDate: async (date: string) => {
        set({ loading: true, error: null })
        
        try {
          const apiUrl = getApiBaseUrl()
          const response = await fetch(`${apiUrl}/transport/schedule/user/getByDate/${date}`)
          
          if (!response.ok) {
            throw new Error(`Failed to fetch schedules: ${response.status} ${response.statusText}`)
          }
          
          const schedules: BusSchedule[] = await response.json()
          const displaySchedules = transformSchedulesForDisplay(schedules)
          
          set({ 
            schedules,
            displaySchedules,
            loading: false,
            selectedDate: date
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bus schedules'
          set({ 
            error: errorMessage,
            loading: false,
            schedules: [],
            displaySchedules: []
          })
          console.error('Bus schedules fetch error:', error)
        }
      },

      setSelectedDate: (date: string) => {
        set({ selectedDate: date })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'bus-schedules-store'
    }
  )
) 