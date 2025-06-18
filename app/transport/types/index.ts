export interface BusSchedule {
  date: string
  day: string
  departureTime: string
  from: string
  arrivalTime: string
  to: string
  status: "scheduled" | "departed" | "waiting"
}

export interface TransportHeaderProps {
  title: string
  description: string
  onNotificationClick?: () => void
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
}

export interface ImportantNotesProps {
  notes: string[]
} 