"use client"

import { useState } from 'react'
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

interface EditStudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: StudentHistory | null
  onSave: (student: StudentHistory) => void
}

function EditStudentModal({ isOpen, onClose, student, onSave }: EditStudentModalProps) {
  const [formData, setFormData] = useState(student || {
    studentName: '',
    studentId: '',
    vendor: '',
    plan: '',
    month: '',
    amount: 0,
    paymentStatus: 'Pending' as const
  })

  if (!isOpen || !student) return null

  const handleSubmit = () => {
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Edit Student Assignment
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student Name
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student ID
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vendor
            </label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plan
            </label>
            <input
              type="text"
              value={formData.plan}
              onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value as 'Completed' | 'Pending' | 'Failed' }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
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
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export function MessStudentHistory() {
  const { vendors, vendorPlans, loading } = useMessAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('June 2025')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentHistory | null>(null)
  const [studentHistory, setStudentHistory] = useState<StudentHistory[]>([
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
      studentName: 'Priya Sharma',
      studentId: '246CSI0201',
      vendor: 'Uniworld',
      plan: 'All Meals',
      month: 'June 2025',
      amount: 8500,
      paymentStatus: 'Completed'
    },
    {
      studentName: 'Rahul Kumar',
      studentId: '246CSI0202',
      vendor: 'GSR',
      plan: 'Lunch, Dinner',
      month: 'June 2025',
      amount: 4500,
      paymentStatus: 'Failed'
    },
    {
      studentName: 'Sneha Patel',
      studentId: '246CSI0203',
      vendor: 'Uniworld',
      plan: 'Breakfast, Lunch',
      month: 'June 2025',
      amount: 6000,
      paymentStatus: 'Completed'
    }
  ])

  const filteredHistory = studentHistory.filter(student =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    student.month === selectedMonth
  )

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-orange-100 text-orange-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAssignPlan = (assignment: any) => {
    console.log('Assigning plan:', assignment)
    const newStudent: StudentHistory = {
      studentName: assignment.studentName,
      studentId: assignment.studentId,
      vendor: assignment.vendorName,
      plan: assignment.planName,
      month: assignment.month,
      amount: assignment.amount,
      paymentStatus: 'Pending'
    }
    setStudentHistory(prev => [...prev, newStudent])
  }

  const handleEditStudent = (student: StudentHistory) => {
    setEditingStudent(student)
    setShowEditModal(true)
  }

  const handleSaveStudent = (updatedStudent: StudentHistory) => {
    setStudentHistory(prev => prev.map(student => 
      student.studentId === editingStudent?.studentId && student.vendor === editingStudent?.vendor 
        ? updatedStudent 
        : student
    ))
  }

  const handleDeleteStudent = (studentToDelete: StudentHistory) => {
    if (!confirm(`Are you sure you want to delete this assignment for ${studentToDelete.studentName}?`)) {
      return
    }
    setStudentHistory(prev => prev.filter(student => 
      !(student.studentId === studentToDelete.studentId && student.vendor === studentToDelete.vendor)
    ))
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHistory.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.studentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.studentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ₹{student.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(student.paymentStatus)}`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEditStudent(student)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(student)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Student Plan Modal */}
      <AssignStudentPlanModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignPlan}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={editingStudent}
        onSave={handleSaveStudent}
      />
    </div>
  )
}
