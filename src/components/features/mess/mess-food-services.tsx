"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StarIcon } from '@/components/ui/primitives/icons'
import { useMessData } from '@/hooks/mess/use-mess-data'
import { useUser } from '@/hooks/auth/use-user'

export function MessFoodServices() {
  const router = useRouter()
  const { userData } = useUser()
  const { vendorPlans, userSelections, loading } = useMessData(userData?.id ? parseInt(userData.id) : undefined)
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  
  // Get current selection for quick stats
  const currentSelection = userSelections?.[0] // Assuming one selection at a time
  
  const handleMessFormNavigation = () => {
    router.push('/mess/cart')
  }
  
  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }
  
  const handleFeedbackSubmit = () => {
    // TODO: Implement feedback submission
    console.log('Feedback:', feedback, 'Rating:', rating)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-[#161616] p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(90.57deg, #2E4CEE 9.91%, #221EBF 53.29%, #040F75 91.56%)' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Food Services</h1>
              <p className="text-blue-100">Track your meal plan and preferences</p>
            </div>
            <button
              onClick={handleMessFormNavigation}
              className="px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 text-white"
              style={{ backgroundColor: '#1A85FF' }}
            >
              <span>📋</span>
              June Mess Form
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Mess Menu Section (Placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Mess Menu
          </h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-sm">Menu upload feature coming soon</p>
              <p className="text-xs mt-1">Admin will upload monthly menu images here</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="space-y-6">
          {/* Current Plan Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h2>
            
            {currentSelection ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                      {currentSelection.vendorName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {currentSelection.vendorName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentSelection.vendorPlanName}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selected plan</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {currentSelection.vendorPlanName}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Plan period</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(currentSelection.selectedMonth).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {currentSelection.mealTypes.map((mealType) => (
                    <span
                      key={mealType}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {mealType === 'BREAKFAST' ? 'Veg' : mealType === 'LUNCH' ? 'Non Veg' : 'Egg'}
                    </span>
                  ))}
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Payment Status
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {new Date(currentSelection.selectedMonth).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}: Paid
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No meal plan selected
                </p>
                <button
                  onClick={handleMessFormNavigation}
                  className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Select a meal plan
                </button>
              </div>
            )}
          </div>

          {/* Mess Feedback Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Mess Feedback
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please rate your experience below
            </p>
            
            {/* Star Rating */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <StarIcon 
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <p className="text-right text-sm text-gray-500 dark:text-gray-400 mb-4">
              {rating}/5 stars
            </p>
            
            {/* Feedback Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the mess service..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {feedback.length}/500 characters
              </p>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleFeedbackSubmit}
              disabled={!rating}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
