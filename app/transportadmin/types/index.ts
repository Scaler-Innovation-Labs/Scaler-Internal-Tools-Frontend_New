export interface BusSchedule {
  date: string
  day: string
  departureTime: string
  from: string
  arrivalTime: string
  to: string
  status: 'SCHEDULED' | 'DEPARTED' | 'WAITING'
}

export interface TransportHeaderProps {
  title: string
  description: string
  onNotificationClick?: () => void
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
  loading?: boolean
  isAdmin?: boolean
}

export interface ImportantNotesProps {
  notes: string[]
} 