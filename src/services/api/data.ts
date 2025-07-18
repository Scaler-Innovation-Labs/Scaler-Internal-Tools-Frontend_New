import type { BusSchedule } from "@/types/features/transport"

export const busScheduleData: BusSchedule[] = [
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "08:00 AM",
    from: "Main Campus",
    arrivalTime: "08:30 AM",
    to: "Engineering Block",
    status: "scheduled"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "09:15 AM",
    from: "Engineering Block",
    arrivalTime: "09:45 AM",
    to: "Science Block",
    status: "departed"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "10:30 AM",
    from: "Science Block",
    arrivalTime: "11:00 AM",
    to: "Main Campus",
    status: "waiting"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "11:45 AM",
    from: "Main Campus",
    arrivalTime: "12:15 PM",
    to: "Engineering Block",
    status: "scheduled"
  },
  {
    date: "2024-03-20",
    day: "Wednesday",
    departureTime: "01:00 PM",
    from: "Engineering Block",
    arrivalTime: "01:30 PM",
    to: "Science Block",
    status: "scheduled"
  }
]

export const importantNotes: string[] = [
  "Buses depart on schedule. Please arrive at the bus stop 5 minutes before departure time.",
  "Bus schedules may change during examination periods and holidays. Check announcements for updates."
] 


export const sampleDocuments = [
  {
    title: "Academic Calendar 2024-25",
    postedDate: "May 04, 2025",
    fileType: "PDF",
    updatedDate: "June 15, 2025",
    tags: ["#schedule", "#calendar", "#important"],
    badgeType: "Important" as const,
    uploadedBy: "Admin Office"
  },
  {
    title: "Student Handbook",
    postedDate: "April 15, 2025",
    fileType: "DOC",
    updatedDate: "April 20, 2025",
    tags: ["#guidelines", "#rules"],
    badgeType: "Administrative" as const,
    uploadedBy: "Academic Affairs"
  },
  {
    title: "Annual Day Celebration",
    postedDate: "March 30, 2025",
    fileType: "PDF",
    updatedDate: "April 01, 2025",
    tags: ["#celebration", "#cultural"],
    badgeType: "Events" as const,
    uploadedBy: "Events Committee"
  },
];

export const formConfig = {
  fileFormats: ["PDF", "DOC", "DOCX", "TXT"],
  categories: ["Academic", "Events", "Administrative"],
  tags: ["#schedule", "#calendar", "#important", "#guidelines", "#rules", "#celebration", "#cultural"],
  allowedUserRoles: ["All", "Student", "Super Admin", "Admin"],
  allowedUserBatches: ["Batch2023", "Batch2024", "Batch2025", "Batch2026", "Batch2027", "Batch2028"],
  defaultSelected: ["Admin", "Batch2023", "Batch2028"]
}; 