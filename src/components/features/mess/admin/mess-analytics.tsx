"use client"

import { useState, useEffect } from 'react'
import { useMessAdmin } from '@/hooks/mess/use-mess-admin'

export function MessAnalytics() {
  const { vendors, vendorPlans, loading } = useMessAdmin()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')

  // Mock analytics data
  const analyticsData = {
    totalRevenue: 125000,
    totalSubscriptions: 45,
    averageRating: 4.2,
    growthPercentage: 12.5,
    vendorPerformance: vendors.map(vendor => ({
      name: vendor.vendorName,
      subscriptions: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      rating: (Math.random() * 2 + 3).toFixed(1)
    })),
    planPopularity: vendorPlans.map(plan => ({
      name: plan.planName,
      vendor: plan.vendorName,
      subscriptions: Math.floor(Math.random() * 15) + 2,
      revenue: plan.fee * (Math.floor(Math.random() * 15) + 2)
    })).sort((a, b) => b.subscriptions - a.subscriptions).slice(0, 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}ly
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-xl">💰</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{analyticsData.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                +{analyticsData.growthPercentage}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-xl">👥</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.totalSubscriptions}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Across all vendors
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
              <span className="text-yellow-600 dark:text-yellow-400 text-xl">⭐</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.averageRating}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Out of 5.0
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-xl">📋</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {vendorPlans.length}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Plans</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {vendors.length} vendors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vendor Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.vendorPerformance.map((vendor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {vendor.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {vendor.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {vendor.subscriptions} subscriptions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ₹{vendor.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    ⭐ {vendor.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Plans */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Popular Plans
          </h3>
          <div className="space-y-4">
            {analyticsData.planPopularity.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {plan.vendor} • {plan.subscriptions} subscribers
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    ₹{plan.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Trends
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Chart visualization coming soon
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Will include subscription trends, revenue charts, and feedback analysis
          </p>
        </div>
      </div>
    </div>
  )
}
