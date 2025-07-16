import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mess Admin | SST Campus Mess Management",
  description: "Admin interface for managing SST campus mess vendors, meal plans, and student selections. Comprehensive mess administration dashboard.",
  keywords: ["SST mess admin", "mess management", "vendor admin", "meal plans", "student selections", "mess dashboard"],
  openGraph: {
    title: "Mess Admin - SST Campus Mess Management",
    description: "Admin interface for managing SST campus mess vendors, meal plans, and student selections",
    type: "website",
  },
}

export default function MessAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
