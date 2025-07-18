import type { BusSchedule } from "../types"

export const busScheduleData: BusSchedule[] = [
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "08:00 AM",
    from: "Main Campus",
    arrivalTime: "08:20 AM",
    to: "Engineering Block",
    status: "scheduled"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "09:15 AM",
    from: "Engineering Block",
    arrivalTime: "09:35 AM",
    to: "Science Block",
    status: "departed"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "10:30 AM",
    from: "Science Block",
    arrivalTime: "10:50 AM",
    to: "Main Campus",
    status: "waiting"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "11:45 AM",
    from: "Main Campus",
    arrivalTime: "12:05 PM",
    to: "Engineering Block",
    status: "scheduled"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "01:00 PM",
    from: "Engineering Block",
    arrivalTime: "01:20 PM",
    to: "Science Block",
    status: "scheduled"
  }
]

export const importantNotes: string[] = [
  "Buses depart on schedule. Please arrive at the bus stop 5 minutes before departure time.",
  "Bus schedules may change during examination periods and holidays. Check announcements for updates."
] 