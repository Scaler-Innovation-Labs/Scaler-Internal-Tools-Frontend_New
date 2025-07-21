"use client"

import { useState, useEffect } from 'react'
import { useMessAdmin } from '@/hooks/mess/use-mess-admin'
import { AssignStudentPlanModal } from './assign-student-plan-modal'

interface StudentHistory {
  studentName: string
  studentId: string
  vendor: string
  plan: string
  month: string
  amount: number
  paymentStatus: 'Completed' | 'Pending' | 'Failed'
}

interface StudentFeedback {
  studentName: string
  rating: number
  feedback: string
  date: string
}

export function MessStudentManagement() {
  const { vendors, vendorPlans, loading } = useMessAdmin()
  const [activeTab, setActiveTab] = useState<'history' | 'feedback'>('history')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('June 2025')
  const [sortBy, setSortBy] = useState('student')
  const [filterBy, setFilterBy] = useState('all')
  const [showAssignModal, setShowAssignModal] = useState(false)

  // Mock student history data
  const studentHistory: StudentHistory[] = [
    {
      studentName: 'Adeola Ayo',
      studentId: '246CSI0200',
      vendor: 'Uniworld',
      plan: 'Breakfast',
      month: 'June 2025',
      amount: 4500,
      paymentStatus: 'Completed'
    },
    {
      studentName: 'Adeola Ayo',
      studentId: '246CSI0200',
      vendor: 'GSR',
      plan: 'Lunch, Dinner',
      month: 'June 2025',
      amount: 4500,
      paymentStatus: 'Pending'
    },
    {
      studentName: 'Adeola Ayo',
      studentId: '246CSI0200',
      vendor: 'Uniworld',
      plan: 'All meals',
      month: 'June 2025',
      amount: 4000,
      paymentStatus: 'Completed'
    },
    {
      studentName: 'Adeola Ayo',
      studentId: '246CSI0200',
      vendor: 'Uniworld',
      plan: 'All meals',
      month: 'June 2025',
      amount: 4000,
      paymentStatus: 'Completed'
    }
  ]

  // Mock feedback data
  const studentFeedback: StudentFeedback[] = [
    {
      studentName: 'Adeola Ayo',
      rating: 4.2,
      feedback: 'The food is okay most days, but sometimes...',
      date: '2025-06-15'
    },
    {
      studentName: 'Adeola Ayo',
      rating: 5.0,
      feedback: 'The food is okay most days, but sometimes...',
      date: '2025-06-14'
    },
    {
      studentName: 'Adeola Ayo',
      rating: 2.8,
      feedback: 'The food is okay most days, but sometimes...',
      date: '2025-06-13'
    },
    {
      studentName: 'Adeola Ayo',
      rating: 3.6,
      feedback: 'The food is okay most days, but sometimes...',
      date: '2025-06-12'
    },
    {
      studentName: 'Adeola Ayo',
      rating: 3.8,
      feedback: 'The food is okay most days, but sometimes...',
      date: '2025-06-11'
    },
    {
      studentName: 'Adeola Ayo',
      rating: 4.1,
      feedback: 'The food is okay most days, but sometimes...',
      date: '2025-06-10'
    }
  ]

  const filteredHistory = studentHistory.filter(record => 
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFeedback = studentFeedback.filter(feedback => 
    feedback.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-orange-100 text-orange-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleAssignPlan = (assignment: any) => {
    console.log('Assigning plan:', assignment)
    // Here you would call the API to assign the plan
    // For now, we'll just log it
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Student History
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'feedback'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Feedback
          </button>
        </div>
      </div>

      {/* Student History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Student History
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="June 2025">June 2025</option>
                  <option value="May 2025">May 2025</option>
                  <option value="April 2025">April 2025</option>
                </select>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    📥 Download
                  </button>
                  <button 
                    onClick={() => setShowAssignModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    + Assign Student Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendor(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Plan(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {record.studentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {record.studentId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {record.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {record.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors" title="Delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing 1 to 5 of 5 entries
              </p>
              <div className="flex space-x-1">
                <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Feedback ({filteredFeedback.length})
              </h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
                  📊 Sort
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center gap-2">
                  🔍 Filter
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFeedback.map((feedback, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {feedback.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-md">
                      <div className="truncate">
                        {feedback.feedback}
                        <button className="ml-2 text-blue-600 hover:text-blue-800 text-xs">
                          read more
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors" title="Delete feedback">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Student Plan Modal */}
      <AssignStudentPlanModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignPlan}
      />
    </div>
  )
}
