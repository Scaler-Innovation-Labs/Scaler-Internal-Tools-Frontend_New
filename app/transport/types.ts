export interface BusSchedule {
  date: string
  day: string
  departureTime: string
  from: string
  arrivalTime: string
  to: string
  status: 'scheduled' | 'departed' | 'waiting'
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
} 