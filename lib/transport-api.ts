import { useAuth } from '@/hooks/use-auth'
import { config } from './config'

export interface BusScheduleResponseDto {
  id: number
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  dayOfWeek: string
  date: string
  busStatus: string
}

export interface BusScheduleSummaryDto {
  id: number
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  dayOfWeek: string
  date: string
  busStatus: string
}

export interface BusScheduleCreateDto {
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  date: string
}

export interface BusScheduleUpdateDto {
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  date: string
}

// Base URL from config
const baseUrl = `${config.api.backendUrl}/transport/schedule`;

export function useTransportApi() {
  const { fetchWithAuth } = useAuth()

  const handleResponse = async <T>(response: Response, signal?: AbortSignal): Promise<T> => {
    // Check if request was aborted before processing response
    if (signal?.aborted) {
      throw new Error('Request was aborted')
    }

    // Handle specific HTTP status codes
    if (!response.ok) {
      switch (response.status) {
        case 404:
          return ([] as unknown) as T // Return empty array for 404
        case 401:
          throw new Error('Authentication failed - please refresh the page')
        case 429:
          throw new Error('Too many requests - please wait a moment')
        case 503:
          throw new Error('Service temporarily unavailable')
        default:
          let errorMessage: string
          try {
            const errorData = await response.json()
            errorMessage = errorData?.message || response.statusText
          } catch (e) {
            errorMessage = response.statusText || 'An error occurred'
          }
          throw new Error(`Request failed: ${errorMessage}`)
      }
    }

    try {
      // Check again if request was aborted before parsing response
      if (signal?.aborted) {
        throw new Error('Request was aborted')
      }
      const data = await response.json()
      return data as T
    } catch (e) {
      if (signal?.aborted) {
        throw new Error('Request was aborted')
      }
      if (e instanceof Error && e.name === 'SyntaxError') {
        throw new Error('Invalid response format from server')
      }
      throw new Error('Failed to parse server response')
    }
  }

  const makeRequest = async <T>(url: string, options: RequestInit = {}, signal?: AbortSignal): Promise<T> => {
    // Check signal before making request
    if (signal?.aborted) {
      throw new Error('Request was aborted')
    }
    
    const fullUrl = `${baseUrl}${url}`
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal,
      credentials: 'include',
    }
    
    try {
      // Check signal again right before fetch
      if (signal?.aborted) {
        throw new Error('Request was aborted')
      }
      
      const response = await fetchWithAuth(fullUrl, requestOptions)
      return handleResponse<T>(response, signal)
    } catch (error) {
      // Handle network errors and aborted requests
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('aborted')) {
          throw new Error('Request was aborted')
        }
        if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
          throw new Error('Network error - please check your connection')
        }
        throw error
      }
      throw new Error('An unknown error occurred')
    }
  }

  return {
    getUserSchedulesByDate: async (date: string, signal?: AbortSignal): Promise<BusScheduleSummaryDto[]> => {
      return makeRequest<BusScheduleSummaryDto[]>(`/user/getByDate/${date}`, {
        method: 'GET',
      }, signal)
    },

    getAdminSchedulesByDate: async (date: string, signal?: AbortSignal): Promise<BusScheduleResponseDto[]> => {
      return makeRequest<BusScheduleResponseDto[]>(`/admin/getByDate/${date}`, {
        method: 'GET',
      }, signal)
    },

    createSchedule: async (schedule: BusScheduleCreateDto): Promise<BusScheduleResponseDto> => {
      return makeRequest<BusScheduleResponseDto>('/admin/create', {
        method: 'POST',
        body: JSON.stringify(schedule),
      })
    },

    updateSchedule: async (id: number, schedule: BusScheduleUpdateDto): Promise<BusScheduleResponseDto> => {
      return makeRequest<BusScheduleResponseDto>(`/admin/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(schedule),
      })
    },

    deleteSchedule: async (id: number): Promise<void> => {
      return makeRequest<void>(`/admin/delete/${id}`, {
        method: 'DELETE',
      })
    }
  }
} 