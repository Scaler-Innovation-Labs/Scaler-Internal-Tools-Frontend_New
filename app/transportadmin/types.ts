export interface BusSchedule {
  id: number;
  date: string;
  day: string;
  departureTime: string;
  from: string;
  arrivalTime: string;
  to: string;
  status: 'SCHEDULED' | 'DEPARTED' | 'WAITING';
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
} 