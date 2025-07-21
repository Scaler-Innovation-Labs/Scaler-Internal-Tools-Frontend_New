"use client"

import { MessAdminDashboard } from "@/components/features/mess/admin/mess-admin-dashboard"

export default function TestMessAdmin() {
  return (
    <div>
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm">
        ⚠️ This is a test route - bypassing admin protection
      </div>
      <MessAdminDashboard />
    </div>
  )
}
