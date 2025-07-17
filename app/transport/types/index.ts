export interface BusSchedule {
  date: string
  day: string
  /** Time in 24h format (HH:mm) */
  departureTime: string
  from: string
  /** Time in 24h format (HH:mm) */
  arrivalTime: string
  to: string
  status: 'SCHEDULED' | 'DEPARTED' | 'WAITING' | 'scheduled' | 'departed' | 'waiting'
}

export interface TransportHeaderProps {
  title: string
  description: string
  onNotificationClick?: () => void
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
  loading?: boolean
}

export interface ImportantNotesProps {
  notes: string[]
} 