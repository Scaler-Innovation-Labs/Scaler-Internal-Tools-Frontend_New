"use client"

import { useState } from 'react'
import { useMessAdmin } from '@/hooks/mess/use-mess-admin'

interface AssignStudentPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (assignment: StudentPlanAssignment) => void
}

interface StudentPlanAssignment {
  studentName: string
  studentId: string
  vendorName: string
  planName: string
  month: string
  amount: number
}

export function AssignStudentPlanModal({ isOpen, onClose, onAssign }: AssignStudentPlanModalProps) {
  const { vendors, vendorPlans } = useMessAdmin()
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    vendorName: '',
    planName: '',
    month: 'July 2025'
  })

  if (!isOpen) return null

  const selectedVendorPlans = vendorPlans.filter(plan => plan.vendorName === formData.vendorName)
  const selectedPlan = vendorPlans.find(plan => plan.planName === formData.planName && plan.vendorName === formData.vendorName)

  const handleSubmit = () => {
    if (!formData.studentName || !formData.studentId || !formData.vendorName || !formData.planName) {
      alert('Please fill all required fields')
      return
    }

    const assignment: StudentPlanAssignment = {
      ...formData,
      amount: selectedPlan?.fee || 0
    }

    onAssign(assignment)
    setFormData({
      studentName: '',
      studentId: '',
      vendorName: '',
      planName: '',
      month: 'July 2025'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Assign Student Plan
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student Name *
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder="Enter student name"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student ID *
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
              placeholder="e.g., 246CSI0200"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vendor *
            </label>
            <select
              value={formData.vendorName}
              onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value, planName: '' }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendorName} value={vendor.vendorName}>
                  {vendor.vendorName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plan *
            </label>
            <select
              value={formData.planName}
              onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
              disabled={!formData.vendorName}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select plan</option>
              {selectedVendorPlans.map((plan) => (
                <option key={plan.planName} value={plan.planName}>
                  {plan.planName} - ₹{plan.fee}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Month *
            </label>
            <select
              value={formData.month}
              onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="July 2025">July 2025</option>
              <option value="August 2025">August 2025</option>
              <option value="September 2025">September 2025</option>
            </select>
          </div>

          {selectedPlan && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Plan Details:</strong> {selectedPlan.planName}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Meal Types:</strong> {selectedPlan.mealTypes.join(', ')}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Monthly Fee:</strong> ₹{selectedPlan.fee.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.studentName || !formData.studentId || !formData.vendorName || !formData.planName}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Assign Plan
          </button>
        </div>
      </div>
    </div>
  )
}
