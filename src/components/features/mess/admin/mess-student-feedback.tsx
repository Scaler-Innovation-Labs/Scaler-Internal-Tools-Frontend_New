"use client"

import { useState } from 'react'
import { useMessAdmin } from '@/hooks/mess/use-mess-admin'

interface StudentFeedback {
  id: string
  studentName: string
  studentId: string
  vendor: string
  rating: number
  comment: string
  date: string
  response?: string
  status: 'Open' | 'Resolved' | 'In Progress'
}

interface RespondToFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: StudentFeedback | null
  onRespond: (feedbackId: string, response: string) => void
}

function RespondToFeedbackModal({ isOpen, onClose, feedback, onRespond }: RespondToFeedbackModalProps) {
  const [response, setResponse] = useState('')

  if (!isOpen || !feedback) return null

  const handleSubmit = () => {
    if (!response.trim()) {
      alert('Please enter a response')
      return
    }
    onRespond(feedback.id, response)
    setResponse('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Respond to Feedback
        </h3>
        
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 dark:text-white">{feedback.studentName}</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < feedback.rating ? "text-yellow-400" : "text-gray-300"}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            <strong>Vendor:</strong> {feedback.vendor}
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
            "{feedback.comment}"
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Response
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response to this feedback..."
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
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
            Send Response
          </button>
        </div>
      </div>
    </div>
  )
}

export function MessStudentFeedback() {
  const { vendors, loading } = useMessAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterVendor, setFilterVendor] = useState('All')
  const [showRespondModal, setShowRespondModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<StudentFeedback | null>(null)
  const [feedbackData, setFeedbackData] = useState<StudentFeedback[]>([
    {
      id: '1',
      studentName: 'Adeola Ayo',
      studentId: '246CSI0200',
      vendor: 'Uniworld',
      rating: 4,
      comment: 'Food quality is good, but sometimes served cold. Service could be faster during lunch hours.',
      date: '2025-06-15',
      status: 'Open'
    },
    {
      id: '2',
      studentName: 'Priya Sharma',
      studentId: '246CSI0201',
      vendor: 'GSR',
      rating: 5,
      comment: 'Excellent food quality and taste! Very satisfied with the service. Keep up the good work.',
      date: '2025-06-14',
      response: 'Thank you for your positive feedback! We are glad you enjoyed our service.',
      status: 'Resolved'
    },
    {
      id: '3',
      studentName: 'Rahul Kumar',
      studentId: '246CSI0202',
      vendor: 'Uniworld',
      rating: 2,
      comment: 'Food was stale and service was very slow. Need improvement in hygiene standards.',
      date: '2025-06-13',
      response: 'We apologize for the inconvenience. We are working on improving our service quality.',
      status: 'In Progress'
    },
    {
      id: '4',
      studentName: 'Sneha Patel',
      studentId: '246CSI0203',
      vendor: 'GSR',
      rating: 3,
      comment: 'Average food quality. Variety could be better. Price is reasonable though.',
      date: '2025-06-12',
      status: 'Open'
    },
    {
      id: '5',
      studentName: 'Arjun Singh',
      studentId: '246CSI0204',
      vendor: 'Uniworld',
      rating: 4,
      comment: 'Good taste but portion sizes are small. Would like bigger servings for the price.',
      date: '2025-06-11',
      status: 'Open'
    }
  ])

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || feedback.status === filterStatus
    const matchesVendor = filterVendor === 'All' || feedback.vendor === filterVendor
    
    return matchesSearch && matchesStatus && matchesVendor
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Open': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRespondToFeedback = (feedback: StudentFeedback) => {
    setSelectedFeedback(feedback)
    setShowRespondModal(true)
  }

  const handleSendResponse = (feedbackId: string, response: string) => {
    setFeedbackData(prev => prev.map(feedback =>
      feedback.id === feedbackId
        ? { ...feedback, response, status: 'Resolved' as const }
        : feedback
    ))
  }

  const handleMarkAsResolved = (feedbackId: string) => {
    setFeedbackData(prev => prev.map(feedback =>
      feedback.id === feedbackId
        ? { ...feedback, status: 'Resolved' as const }
        : feedback
    ))
  }

  const handleDeleteFeedback = (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return
    }
    setFeedbackData(prev => prev.filter(feedback => feedback.id !== feedbackId))
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
              Student Feedback
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendorName} value={vendor.vendorName}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="p-6 space-y-4">
          {filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feedback.studentName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {feedback.studentId} • {feedback.vendor}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < feedback.rating ? "text-yellow-400" : "text-gray-300"}>
                        ⭐
                      </span>
                    ))}
                    <span className={`ml-2 font-semibold ${getRatingColor(feedback.rating)}`}>
                      {feedback.rating}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {feedback.date}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">
                "{feedback.comment}"
              </p>

              {feedback.response && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Admin Response:</strong> {feedback.response}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {feedback.status !== 'Resolved' && (
                  <>
                    <button
                      onClick={() => handleRespondToFeedback(feedback)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Respond
                    </button>
                    <button
                      onClick={() => handleMarkAsResolved(feedback.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteFeedback(feedback.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredFeedback.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No feedback found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Respond to Feedback Modal */}
      <RespondToFeedbackModal
        isOpen={showRespondModal}
        onClose={() => setShowRespondModal(false)}
        feedback={selectedFeedback}
        onRespond={handleSendResponse}
      />
    </div>
  )
}
