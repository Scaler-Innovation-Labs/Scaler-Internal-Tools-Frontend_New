"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/use-auth'
import { useMessAdmin } from '@/hooks/mess/use-mess-admin'
import { MessStudentHistory } from './mess-student-history'
import { MessStudentFeedback } from './mess-student-feedback'
import { MessDebugPanel } from '../debug/mess-debug-panel'
import type { 
  VendorCreateDto,
  VendorPlanCreateDto,
  MealType
} from '@/types/mess'

export function MessAdminDashboard() {
  const router = useRouter()
  const { userRoles } = useAuth()
  const { 
    vendors, 
    vendorPlans, 
    loading, 
    error, 
    createVendor, 
    createVendorPlan,
    deleteVendor,
    deleteVendorPlan,
    refreshData 
  } = useMessAdmin()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'plans' | 'students' | 'feedback' | 'menu' | 'debug'>('debug')
  
  // Debug logging
  console.log('MessAdminDashboard Debug:', {
    userRoles,
    vendors,
    vendorPlans,
    loading,
    error,
    activeTab
  })
  
  // Modal states
  const [showAddVendorModal, setShowAddVendorModal] = useState(false)
  const [showAddPlanModal, setShowAddPlanModal] = useState(false)
  const [showUploadMenuModal, setShowUploadMenuModal] = useState(false)

  // Form states
  const [newVendorName, setNewVendorName] = useState('')
  const [newPlan, setNewPlan] = useState({
    planName: '',
    vendorName: '',
    fee: '',
    mealTypes: [] as string[]
  })

  const handleAddVendor = async () => {
    if (!newVendorName.trim()) return
    
    try {
      const vendorData: VendorCreateDto = { vendorName: newVendorName }
      const success = await createVendor(vendorData)
      
      if (success) {
        setNewVendorName('')
        setShowAddVendorModal(false)
      } else {
        alert('Failed to add vendor')
      }
    } catch (error) {
      console.error('Error adding vendor:', error)
      alert('Failed to add vendor')
    }
  }

  const handleAddPlan = async () => {
    if (!newPlan.planName || !newPlan.vendorName || !newPlan.fee || newPlan.mealTypes.length === 0) return
    
    try {
      // Find vendor ID by vendor name
      const selectedVendor = vendors.find(v => v.vendorName === newPlan.vendorName)
      if (!selectedVendor) {
        alert('Selected vendor not found')
        return
      }
      
      // Note: VendorSummaryDto should include vendorId from API
      const vendorId = (selectedVendor as any).vendorId || 0
      if (vendorId === 0) {
        console.error('Vendor ID is missing from API response. Backend team needs to include vendorId in VendorSummaryDto')
        alert('Error: Vendor ID is missing. Please contact support.')
        return
      }
      
      const planData: VendorPlanCreateDto = {
        planName: newPlan.planName,
        vendorId: vendorId,
        fee: parseInt(newPlan.fee),
        mealTypes: newPlan.mealTypes as MealType[]
      }
      
      const success = await createVendorPlan(planData)
      
      if (success) {
        setNewPlan({
          planName: '',
          vendorName: '',
          fee: '',
          mealTypes: []
        })
        setShowAddPlanModal(false)
      } else {
        alert('Failed to add plan')
      }
    } catch (error) {
      console.error('Error adding plan:', error)
      alert('Failed to add plan')
    }
  }

  const handleDeleteVendor = async (vendorName: string) => {
    if (!confirm(`Are you sure you want to delete ${vendorName}? This will also delete all associated plans.`)) {
      return
    }
    
    // Find vendor ID by vendor name
    const selectedVendor = vendors.find(v => v.vendorName === vendorName)
    if (!selectedVendor) {
      alert('Vendor not found')
      return
    }
    
    // Note: VendorSummaryDto should include vendorId from API
    const vendorId = (selectedVendor as any).vendorId || 0
    if (vendorId === 0) {
      console.error('Vendor ID is missing from API response. Backend team needs to include vendorId in VendorSummaryDto')
      alert('Error: Vendor ID is missing. Please contact support.')
      return
    }
    
    const success = await deleteVendor(vendorId)
    if (!success) {
      alert('Failed to delete vendor')
    }
  }

  const handleDeletePlan = async (planName: string, vendorName: string) => {
    if (!confirm(`Are you sure you want to delete the plan "${planName}"?`)) {
      return
    }
    
    // Find plan ID by plan name and vendor name
    const selectedPlan = vendorPlans.find(p => p.planName === planName && p.vendorName === vendorName)
    if (!selectedPlan) {
      alert('Plan not found')
      return
    }
    
    // Note: VendorPlanSummaryDto should include vendorPlanId from API
    const planId = (selectedPlan as any).vendorPlanId || 0
    if (planId === 0) {
      console.error('Plan ID is missing from API response. Backend team needs to include vendorPlanId in VendorPlanSummaryDto')
      alert('Error: Plan ID is missing. Please contact support.')
      return
    }
    
    const success = await deleteVendorPlan(planId)
    if (!success) {
      alert('Failed to delete plan')
    }
  }

  const toggleMealType = (mealType: string) => {
    setNewPlan(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter(type => type !== mealType)
        : [...prev.mealTypes, mealType]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading mess admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
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
              <h1 className="text-3xl font-bold mb-2">Mess Administration</h1>
              <p className="text-blue-100">Manage vendors, meal plans, and mess services</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddVendorModal(true)}
                className="px-4 py-2 rounded-xl font-semibold transition-colors text-white"
                style={{ backgroundColor: '#1A85FF' }}
              >
                + Add Vendor
              </button>
              <button
                onClick={() => setShowAddPlanModal(true)}
                className="px-4 py-2 rounded-xl font-semibold transition-colors text-white"
                style={{ backgroundColor: '#1A85FF' }}
              >
                + Add Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm">
          <div className="flex gap-2">
            {(['overview', 'vendors', 'plans', 'students', 'feedback', 'menu', 'debug'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Stats Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🏢</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vendors.length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">📋</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vendorPlans.length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Plans</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Vendors
            </h2>
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Add New Vendor
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {vendor.vendorName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {vendor.vendorName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {vendorPlans.filter(plan => plan.vendorName === vendor.vendorName).length} plans
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteVendor(vendor.vendorName)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete vendor"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Meal Plans
            </h2>
            <button
              onClick={() => setShowAddPlanModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Add New Plan
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorPlans.map((plan, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {plan.planName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.vendorName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePlan(plan.planName, plan.vendorName)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete plan"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="mb-3">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹ {plan.fee.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {plan.mealTypes.map((mealType) => (
                    <span
                      key={mealType}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {mealType}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Monthly Menu Management
            </h2>
            <button
              onClick={() => setShowUploadMenuModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📸 Upload Menu
            </button>
          </div>
          
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Menu Uploaded
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload monthly menu images for students to view
            </p>
            <button
              onClick={() => setShowUploadMenuModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upload First Menu
            </button>
          </div>
        </div>
      )}

      {activeTab === 'students' && <MessStudentHistory />}

      {activeTab === 'feedback' && <MessStudentFeedback />}

      {activeTab === 'debug' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Debug Panel - Troubleshoot 403 Errors
          </h2>
          <MessDebugPanel />
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Vendor
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vendor Name
              </label>
              <input
                type="text"
                value={newVendorName}
                onChange={(e) => setNewVendorName(e.target.value)}
                placeholder="Enter vendor name"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                disabled={!newVendorName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Meal Plan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={newPlan.planName}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, planName: e.target.value }))}
                  placeholder="Enter plan name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor
                </label>
                <select
                  value={newPlan.vendorName}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, vendorName: e.target.value }))}
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
                  Monthly Fee (₹)
                </label>
                <input
                  type="number"
                  value={newPlan.fee}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, fee: e.target.value }))}
                  placeholder="Enter monthly fee"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meal Types
                </label>
                <div className="flex gap-2">
                  {['BREAKFAST', 'LUNCH', 'DINNER'].map((mealType) => (
                    <button
                      key={mealType}
                      onClick={() => toggleMealType(mealType)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newPlan.mealTypes.includes(mealType)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mealType}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlan}
                disabled={!newPlan.planName || !newPlan.vendorName || !newPlan.fee || newPlan.mealTypes.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Menu Modal */}
      {showUploadMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Monthly Menu
            </h3>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <span className="text-2xl">📷</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload menu images for the current month
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="menu-upload"
              />
              <label
                htmlFor="menu-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose Images
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadMenuModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement menu upload
                  setShowUploadMenuModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
