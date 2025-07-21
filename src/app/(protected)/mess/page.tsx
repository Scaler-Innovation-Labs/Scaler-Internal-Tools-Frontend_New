"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MessFoodServices } from "@/components/features/mess/mess-food-services"

export default function MessPage() {
  return (
    <DashboardLayout>
      <MessFoodServices />
    </DashboardLayout>
  )
} 