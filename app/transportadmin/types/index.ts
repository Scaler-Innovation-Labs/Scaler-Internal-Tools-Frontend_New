import type { BusScheduleResponseDto } from "@/lib/transport-api";

export interface BusSchedule {
  id: number;
  date: string;
  day: string;
  departureTime: string;
  from: string;
  arrivalTime: string;
  to: string;
  status: 'SCHEDULED' | 'DEPARTED' | 'WAITING';
  source: string;
  destination: string;
  dayOfWeek: string;
  busStatus: string;
  studentsBoarded?: number;
}

export interface TransportHeaderProps {
  title: string
  description: string
  onNotificationClick?: () => void
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[];
  loading?: boolean;
  onEdit?: (schedule: BusSchedule) => void;
  onDelete?: (schedule: BusSchedule) => void;
}

export interface ImportantNotesProps {
  notes: string[]
} 