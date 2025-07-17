export interface BusSchedule {
  id: string | number
  date: string
  day: string
  departureTime: string
  from: string
  arrivalTime: string
  to: string
  status: 'scheduled' | 'departed' | 'waiting'
}

export interface ImportantNotesProps {
  notes?: string[]
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
} 