import type { BusSchedule } from "../types"

export const busScheduleData: BusSchedule[] = [
  {
    date: "June 24, 2024",
    day: "Monday",
    departureTime: "10:00 AM",
    from: "Macro Campus",
    arrivalTime: "10:30 AM",
    to: "Micro Campus",
    status: "scheduled"
  },
  {
    date: "June 24, 2024",
    day: "Monday",
    departureTime: "02:00 PM",
    from: "Micro Campus",
    arrivalTime: "02:30 PM",
    to: "Macro Campus",
    status: "departed"
  },
  {
    date: "June 24, 2024",
    day: "Monday",
    departureTime: "04:00 PM",
    from: "Macro Campus",
    arrivalTime: "04:30 PM",
    to: "Micro Campus",
    status: "waiting"
  }
]

export const importantNotes = [
  "Please arrive at the bus stop 5 minutes before the scheduled departure time.",
  "Students must show their ID cards to board the bus.",
  "Face masks are recommended but not mandatory.",
  "The bus service operates on weekdays only.",
  "For any schedule changes, please check the transport services page regularly."
] 