import type React from "react"

export interface BusSchedule {
  id: string
  busNumber: string
  route: string
  departureTime: string
  arrivalTime: string
  status: "on-time" | "delayed" | "cancelled"
  capacity: number
  delay?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  badge?: number
}

export interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  href: string
}

// Component prop types
export interface DashboardLayoutProps {
  children: React.ReactNode
  activeItem?: string
  isBlurred?: boolean
}

export interface BusScheduleTableProps {
  schedules: BusSchedule[]
  loading?: boolean
  className?: string
}

// Re-export ticket types for easy access
export * from "./features/tickets"
