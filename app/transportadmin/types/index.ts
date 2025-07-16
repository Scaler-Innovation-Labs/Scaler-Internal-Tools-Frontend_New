import type { BusScheduleResponseDto } from "@/lib/transport-api";

export interface BusSchedule {
  id: number;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  dayOfWeek: string;
  date: string;
  busStatus: string;
  day: string;
  from: string;
  to: string;
  status: 'SCHEDULED' | 'DEPARTED' | 'WAITING';
}

export interface TransportHeaderProps {
  title: string
  description: string
  onNotificationClick?: () => void
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[];
  loading?: boolean;
}

export interface ImportantNotesProps {
  notes: string[]
} 