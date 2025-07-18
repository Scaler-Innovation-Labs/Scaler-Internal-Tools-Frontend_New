import { useState, useCallback } from 'react'

export interface DateSelectorHook {
  selectedDate: string
  setDate: (date: string) => void
  incrementDate: () => void
  decrementDate: () => void
  setToday: () => void
  isToday: boolean
  formattedDate: string
}

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Format date for display
const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Add/subtract days from date
const addDays = (dateString: string, days: number): string => {
  try {
    const date = new Date(dateString)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  } catch {
    return dateString
  }
}

export const useDateSelector = (initialDate?: string): DateSelectorHook => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayDate())
  
  const setDate = useCallback((date: string) => {
    setSelectedDate(date)
  }, [])
  
  const incrementDate = useCallback(() => {
    setSelectedDate(prev => addDays(prev, 1))
  }, [])
  
  const decrementDate = useCallback(() => {
    setSelectedDate(prev => addDays(prev, -1))
  }, [])
  
  const setToday = useCallback(() => {
    setSelectedDate(getTodayDate())
  }, [])
  
  const isToday = selectedDate === getTodayDate()
  const formattedDate = formatDateForDisplay(selectedDate)
  
  return {
    selectedDate,
    setDate,
    incrementDate,
    decrementDate,
    setToday,
    isToday,
    formattedDate
  }
} 