import type { Metadata } from "next"
import AdminRoute from "@/components/admin-route"

export const metadata: Metadata = {
  title: "Transport Admin | SST Campus Bus Schedules",
  description: "Admin interface for managing SST campus bus schedules and transportation services.",
  keywords: ["SST transport admin", "campus bus management", "transportation admin"],
  openGraph: {
    title: "Transport Admin - SST Campus Bus Schedules",
    description: "Admin interface for managing SST campus bus schedules",
    type: "website",
  },
}

export default function TransportAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminRoute>{children}</AdminRoute>
} 