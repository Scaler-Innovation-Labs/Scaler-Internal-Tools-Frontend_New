"use client"

import { memo } from "react"
import { UtensilsIcon, UserIcon, CalendarIcon } from "@/components/ui/icons"
import { formatCurrency, formatDate, getStatusColor, capitalize } from "../utils"
import type { PlansTableProps } from "../types"

export const PlansTable = memo(function PlansTable({ 
  plans, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: PlansTableProps) {

  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.vendorPlanId}
            className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {plan.planName}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.vendorName}
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                {capitalize(plan.status)}
              </span>
            </div>
            
            {/* Plan Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Fee</div>
                <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(plan.fee)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Students</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.enrolledStudents}
                </div>
              </div>
            </div>

            {/* Meal Types */}
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Meal Types</div>
              <div className="flex flex-wrap gap-1">
                {plan.mealTypes.map((mealType, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                  >
                    {mealType}
                  </span>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Created: {formatDate(plan.createdAt)} | 
              Updated: {formatDate(plan.lastUpdated)}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(plan)}
                className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onToggleStatus(plan.vendorPlanId, plan.status === 'active' ? 'inactive' : 'active')}
                className="px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              >
                {plan.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => onDelete(plan.vendorPlanId)}
                className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Meal Types
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
            {plans.map((plan) => (
              <tr key={plan.vendorPlanId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {plan.planName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {plan.vendorPlanId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {plan.vendorName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(plan.fee)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {plan.mealTypes.slice(0, 2).map((mealType, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      >
                        {mealType}
                      </span>
                    ))}
                    {plan.mealTypes.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{plan.mealTypes.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {plan.enrolledStudents}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                    {capitalize(plan.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(plan)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(plan.vendorPlanId, plan.status === 'active' ? 'inactive' : 'active')}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm font-medium"
                    >
                      {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onDelete(plan.vendorPlanId)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
})

PlansTable.displayName = 'PlansTable'
