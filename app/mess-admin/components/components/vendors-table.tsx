"use client"

import { memo } from "react"
import { UtensilsIcon, CalendarIcon, UserIcon } from "@/components/ui/icons"
import { formatCurrency, formatDate, getStatusColor, capitalize } from "../utils"
import type { VendorsTableProps } from "../types"

export const VendorsTable = memo(function VendorsTable({ 
  vendors, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: VendorsTableProps) {

  return (
    <>
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.vendorId}
            className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Vendor Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <UtensilsIcon size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {vendor.vendorName}
                </span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.status)}`}>
                {capitalize(vendor.status)}
              </span>
            </div>
            
            {/* Vendor Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Plans</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {vendor.totalPlans}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Students</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {vendor.totalStudents}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
                <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(vendor.monthlyRevenue)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(vendor.lastUpdated)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(vendor)}
                className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onToggleStatus(vendor.vendorId, vendor.status === 'active' ? 'inactive' : 'active')}
                className="px-3 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              >
                {vendor.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => onDelete(vendor.vendorId)}
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
                Vendor
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Plans
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
            {vendors.map((vendor) => (
              <tr key={vendor.vendorId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UtensilsIcon size={16} className="text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {vendor.vendorName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {vendor.vendorId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {vendor.totalPlans}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {vendor.totalStudents}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(vendor.monthlyRevenue)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                    {capitalize(vendor.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(vendor.lastUpdated)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(vendor.vendorId, vendor.status === 'active' ? 'inactive' : 'active')}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm font-medium"
                    >
                      {vendor.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onDelete(vendor.vendorId)}
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

VendorsTable.displayName = 'VendorsTable'
