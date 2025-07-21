"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMessData } from '@/hooks/mess/use-mess-data'
import { useUser } from '@/hooks/auth/use-user'
import { vendorPlanSelectionApi } from '@/lib/api/mess'
import type { 
  VendorPlanSummaryDto, 
  VendorPlanSelectionCreateDto,
  HostelType 
} from '@/types/mess'

interface CartItem {
  vendorPlanId: number
  planName: string
  vendorName: string
  fee: number
  mealTypes: string[]
}

export function MessCart() {
  const router = useRouter()
  const { userData } = useUser()
  const { vendorPlans, vendors, loading, refreshData } = useMessData(userData?.id ? parseInt(userData.id) : undefined)
  
  const [activeTab, setActiveTab] = useState('Uniworld')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [dietPreference, setDietPreference] = useState('Veg')
  const [roomNumber, setRoomNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get vendor plans by vendor name
  const getVendorPlansByVendor = (vendorName: string) => {
    return vendorPlans.filter(plan => plan.vendorName === vendorName)
  }

  const handleAddToCart = (plan: VendorPlanSummaryDto) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.planName === plan.planName && item.vendorName === plan.vendorName)
    if (existingItem) return

    // Generate a mock vendor plan ID based on plan name hash
    const mockVendorPlanId = Math.abs(plan.planName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0))

    const cartItem: CartItem = {
      vendorPlanId: mockVendorPlanId,
      planName: plan.planName,
      vendorName: plan.vendorName,
      fee: plan.fee,
      mealTypes: plan.mealTypes
    }
    
    setCartItems(prev => [...prev, cartItem])
  }

  const handleRemoveFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.fee, 0)
  }

  const handleSubmitPreference = async () => {
    if (!userData?.id || cartItems.length === 0 || !roomNumber) {
      alert('Please fill all required fields and add items to cart')
      return
    }

    setIsSubmitting(true)
    try {
      const currentDate = new Date().toISOString().split('T')[0]
      if (!currentDate) {
        alert('Error with date formatting')
        return
      }

      // For now, just simulate API call with mock data
      console.log('Mock submission:', {
        userId: userData.id,
        cartItems,
        roomNumber,
        dietPreference,
        selectedMonth: currentDate
      })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Uncomment when API is ready
      // const selections: VendorPlanSelectionCreateDto[] = cartItems.map(item => ({
      //   vendorPlanId: item.vendorPlanId,
      //   userId: parseInt(userData.id),
      //   selectedMonth: currentDate,
      //   roomNumber: parseInt(roomNumber),
      //   hostel: 'Uniworld_1' as HostelType
      // }))
      // await vendorPlanSelectionApi.create(parseInt(userData.id), selections)

      alert('Meal plan preferences submitted successfully!')
      setCartItems([])
      setRoomNumber('')
      await refreshData()
      router.push('/mess')
    } catch (error) {
      console.error('Error submitting preferences:', error)
      alert('Failed to submit preferences. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
            >
              <span className="text-white text-xl">←</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold mb-2">Mess Service Cart</h1>
              <p className="text-blue-100">Choose your meal plans and add them to cart</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vendor Plans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-2 mb-6">
              {['Uniworld', 'GSR', 'Other Vendor'].map((vendor) => (
                <button
                  key={vendor}
                  onClick={() => setActiveTab(vendor)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                    activeTab === vendor
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {vendor}
                </button>
              ))}
            </div>

            {/* Meal Plans for Active Vendor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getVendorPlansByVendor(activeTab).map((plan, index) => (
                <div
                  key={`${plan.planName}-${index}`}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {plan.planName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {plan.mealTypes.join(', ')}
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₹ {plan.fee.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(plan)}
                    disabled={cartItems.some(item => item.planName === plan.planName && item.vendorName === plan.vendorName)}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    {cartItems.some(item => item.planName === plan.planName && item.vendorName === plan.vendorName) 
                      ? 'Added' 
                      : '+ Add'
                    }
                  </button>
                </div>
              ))}
              
              {getVendorPlansByVendor(activeTab).length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                  No meal plans available for {activeTab}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Cart & Checkout */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🛒 Your Cart ({cartItems.length})
            </h2>
            
            {cartItems.length > 0 ? (
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {item.vendorName}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.planName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      ₹ {item.fee.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-sm">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Checkout Details */}
          {cartItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📋 Checkout Details
              </h2>
              
              {/* Diet Preference */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diet Preference
                </label>
                <div className="flex gap-2">
                  {['Veg', 'Non Veg', 'Egg'].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setDietPreference(diet)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dietPreference === diet
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Enter your room number"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Total Amount */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ₹ {getTotalAmount().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitPreference}
                disabled={isSubmitting || !roomNumber}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Preference'}
              </button>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Meal plan changes will be effective from the 1st of the next month. 
                  You can make changes to your plan until the 25th of the current month.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
