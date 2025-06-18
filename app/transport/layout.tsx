import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transport Services | SST Campus Bus Schedules",
  description: "Access SST campus bus schedules, departure times, and real-time transportation information. Stay updated with Micro Campus to Macro Campus shuttle services.",
  keywords: ["SST transport", "campus bus", "shuttle schedule", "micro campus", "macro campus", "bus timing"],
  openGraph: {
    title: "Transport Services - SST Campus Bus Schedules",
    description: "Access SST campus bus schedules and real-time transportation information",
    type: "website",
  },
}

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 