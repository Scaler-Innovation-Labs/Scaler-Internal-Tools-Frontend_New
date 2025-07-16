"use client"

import { memo } from "react"
import { 
  UserIcon, 
  UtensilsIcon, 
  BellIcon, 
  InfoIcon, 
  CalendarIcon 
} from "@/components/ui/icons"
import { formatCurrency } from "../utils"
import type { MessStats } from "../types"

interface StatsCardsProps {
  stats: MessStats
  loading?: boolean
}

export const StatsCards = memo(function StatsCards({ stats, loading = false }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  const statsConfig = [
    {
      label: "Total Vendors",
      value: stats.totalVendors,
      icon: UtensilsIcon,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "Active Plans",
      value: stats.totalActivePlans,
      icon: InfoIcon,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      label: "Students Enrolled",
      value: stats.totalStudentsEnrolled,
      icon: UserIcon,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: CalendarIcon,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      label: "Average Rating",
      value: `${stats.averageRating.toFixed(1)}/5`,
      icon: BellIcon,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4`}>
            <stat.icon size={24} className={stat.color} />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
})

StatsCards.displayName = 'StatsCards'
