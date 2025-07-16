"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Suspense, lazy, useState, useEffect } from "react"
import { UtensilsIcon, CalendarIcon, UserIcon, BellIcon } from "@/components/ui/icons"
import { StatsCards } from "./components/stats-cards"
import { VendorsTable } from "./components/vendors-table"
import { PlansTable } from "./components/plans-table"
import { VendorFormModal } from "./components/vendor-form-modal"
import { PlanFormModal } from "./components/plan-form-modal"
import { createMessAdminApi } from "./lib/api"
import { useAuth } from "@/hooks/use-auth"
import type { MessStats, VendorWithStats, PlanWithDetails, CreateVendorForm, CreatePlanForm } from "./types"

// Mock data for demonstration
const mockStats: MessStats = {
  totalVendors: 12,
  totalActivePlans: 28,
  totalStudentsEnrolled: 450,
  monthlyRevenue: 125000,
  averageRating: 4.2
}

const mockVendors: VendorWithStats[] = [
  {
    vendorId: 1,
    vendorName: "Delicious Delights",
    totalPlans: 3,
    totalStudents: 120,
    monthlyRevenue: 35000,
    status: 'active',
    lastUpdated: '2024-12-28T10:30:00Z'
  },
  {
    vendorId: 2,
    vendorName: "Healthy Bites",
    totalPlans: 2,
    totalStudents: 85,
    monthlyRevenue: 22000,
    status: 'active',
    lastUpdated: '2024-12-27T15:45:00Z'
  },
  {
    vendorId: 3,
    vendorName: "Spice Garden",
    totalPlans: 4,
    totalStudents: 200,
    monthlyRevenue: 55000,
    status: 'inactive',
    lastUpdated: '2024-12-26T09:15:00Z'
  }
]

const mockPlans: PlanWithDetails[] = [
  {
    vendorPlanId: 1,
    planName: "Basic Meal Plan",
    vendorName: "Delicious Delights",
    fee: 3500,
    mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
    enrolledStudents: 85,
    status: 'active',
    createdAt: '2024-11-15T10:00:00Z',
    lastUpdated: '2024-12-20T14:30:00Z'
  },
  {
    vendorPlanId: 2,
    planName: "Premium Meal Plan",
    vendorName: "Delicious Delights",
    fee: 4500,
    mealTypes: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    enrolledStudents: 35,
    status: 'active',
    createdAt: '2024-11-10T09:00:00Z',
    lastUpdated: '2024-12-18T11:15:00Z'
  },
  {
    vendorPlanId: 3,
    planName: "Healthy Choice",
    vendorName: "Healthy Bites",
    fee: 4000,
    mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
    enrolledStudents: 85,
    status: 'active',
    createdAt: '2024-11-20T08:30:00Z',
    lastUpdated: '2024-12-22T16:45:00Z'
  }
]

// Skeleton components
const TableSkeleton = () => (
  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md min-h-[400px] animate-pulse">
    <div className="p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-1/4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-600 rounded" />
        ))}
      </div>
    </div>
  </div>
)

export default function MessAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'plans' | 'students'>('overview')
  const [stats, setStats] = useState<MessStats>(mockStats)
  const [vendors, setVendors] = useState<VendorWithStats[]>(mockVendors)
  const [plans, setPlans] = useState<PlanWithDetails[]>(mockPlans)
  const [loading, setLoading] = useState(false)
  
  // Modal states
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<VendorWithStats | undefined>()
  const [editingPlan, setEditingPlan] = useState<PlanWithDetails | undefined>()

  // Get auth context and fetchWithAuth
  const { fetchWithAuth } = useAuth()

  // Initialize API
  const messAdminApi = createMessAdminApi(fetchWithAuth)

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from API
        // const statsData = await messAdminApi.dashboard.getStats()
        // setStats(statsData)
        
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [activeTab])

  const handleEditVendor = (vendor: VendorWithStats) => {
    setEditingVendor(vendor)
    setIsVendorModalOpen(true)
  }

  const handleDeleteVendor = async (vendorId: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      console.log('Delete vendor:', vendorId)
      // Implement vendor deletion
      setVendors(prev => prev.filter(v => v.vendorId !== vendorId))
    }
  }

  const handleToggleVendorStatus = async (vendorId: number, status: 'active' | 'inactive') => {
    console.log('Toggle vendor status:', vendorId, status)
    // Implement status toggle
    setVendors(prev => prev.map(v => 
      v.vendorId === vendorId ? { ...v, status } : v
    ))
  }

  const handleCreateVendor = async (formData: CreateVendorForm) => {
    console.log('Create vendor:', formData)
    // Implement vendor creation
    const newVendor: VendorWithStats = {
      vendorId: Math.max(...vendors.map(v => v.vendorId)) + 1,
      vendorName: formData.vendorName,
      totalPlans: 0,
      totalStudents: 0,
      monthlyRevenue: 0,
      status: 'active',
      lastUpdated: new Date().toISOString()
    }
    setVendors(prev => [...prev, newVendor])
    setEditingVendor(undefined)
  }

  const handleEditPlan = (plan: PlanWithDetails) => {
    setEditingPlan(plan)
    setIsPlanModalOpen(true)
  }

  const handleDeletePlan = async (planId: number) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      console.log('Delete plan:', planId)
      // Implement plan deletion
      setPlans(prev => prev.filter(p => p.vendorPlanId !== planId))
    }
  }

  const handleTogglePlanStatus = async (planId: number, status: 'active' | 'inactive') => {
    console.log('Toggle plan status:', planId, status)
    // Implement status toggle
    setPlans(prev => prev.map(p => 
      p.vendorPlanId === planId ? { ...p, status } : p
    ))
  }

  const handleCreatePlan = async (formData: CreatePlanForm) => {
    console.log('Create plan:', formData)
    // Implement plan creation
    const vendor = vendors.find(v => v.vendorId === formData.vendorId)
    if (vendor) {
      const newPlan: PlanWithDetails = {
        vendorPlanId: Math.max(...plans.map(p => p.vendorPlanId)) + 1,
        planName: formData.planName,
        vendorName: vendor.vendorName,
        fee: formData.fee,
        mealTypes: formData.mealTypes,
        enrolledStudents: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
      setPlans(prev => [...prev, newPlan])
    }
    setEditingPlan(undefined)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: CalendarIcon },
    { id: 'vendors', label: 'Vendors', icon: UtensilsIcon },
    { id: 'plans', label: 'Plans', icon: BellIcon },
    { id: 'students', label: 'Students', icon: UserIcon }
  ] as const

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">
        {/* Header */}
        <div className="w-full max-w-7xl px-4 sm:px-8 mx-auto mt-6">
          <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-6 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Mess Administration</h1>
              <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[320px] sm:max-w-none">
                Manage vendors, meal plans, and student enrollments for campus mess services.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="w-full max-w-7xl px-4 sm:px-8 mx-auto">
          <StatsCards stats={stats} loading={loading} />
        </div>

        {/* Navigation Tabs */}
        <div className="w-full max-w-7xl px-4 sm:px-8 mx-auto mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon
                    className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl px-4 sm:px-8 mx-auto mb-12">
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setIsVendorModalOpen(true)}
                        className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <div className="font-medium text-blue-900 dark:text-blue-100">Add New Vendor</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Register a new mess vendor</div>
                      </button>
                      <button 
                        onClick={() => setIsPlanModalOpen(true)}
                        className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <div className="font-medium text-green-900 dark:text-green-100">Create Meal Plan</div>
                        <div className="text-sm text-green-600 dark:text-green-400">Add a new meal plan option</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        <div className="font-medium text-purple-900 dark:text-purple-100">Generate Report</div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">Export enrollment and revenue data</div>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            New vendor "Tasty Treats" approved
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Meal plan "Premium Plus" updated
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            45 new student enrollments today
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Vendor Management
                  </h2>
                  <button 
                    onClick={() => setIsVendorModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Vendor
                  </button>
                </div>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <VendorsTable
                    vendors={vendors}
                    onEdit={handleEditVendor}
                    onDelete={handleDeleteVendor}
                    onToggleStatus={handleToggleVendorStatus}
                  />
                )}
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Meal Plan Management
                  </h2>
                  <button 
                    onClick={() => setIsPlanModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Create Plan
                  </button>
                </div>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <PlansTable
                    plans={plans}
                    onEdit={handleEditPlan}
                    onDelete={handleDeletePlan}
                    onToggleStatus={handleTogglePlanStatus}
                  />
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Student Enrollments
                  </h2>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Export Data
                  </button>
                </div>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <UserIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Student enrollment management coming soon...</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Modals */}
        <VendorFormModal
          isOpen={isVendorModalOpen}
          onClose={() => {
            setIsVendorModalOpen(false)
            setEditingVendor(undefined)
          }}
          onSubmit={handleCreateVendor}
          vendor={editingVendor}
          isEditing={!!editingVendor}
        />

        <PlanFormModal
          isOpen={isPlanModalOpen}
          onClose={() => {
            setIsPlanModalOpen(false)
            setEditingPlan(undefined)
          }}
          onSubmit={handleCreatePlan}
          vendors={vendors}
          plan={editingPlan}
          isEditing={!!editingPlan}
        />
      </div>
    </DashboardLayout>
  )
}
