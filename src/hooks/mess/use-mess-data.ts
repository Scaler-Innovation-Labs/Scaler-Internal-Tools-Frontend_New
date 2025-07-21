"use client"

import { useState, useEffect } from 'react'
import { vendorPlanApi, vendorPlanSelectionApi, vendorApi } from '@/lib/api/mess'
import { mockVendors, mockVendorPlans } from '@/lib/mock-data/mess'
import type { 
  VendorPlanSummaryDto, 
  VendorPlanSelectionResponseDto,
  VendorSummaryDto 
} from '@/types/mess'

export function useMessData(userId?: number) {
  const [vendorPlans, setVendorPlans] = useState<VendorPlanSummaryDto[]>([])
  const [vendors, setVendors] = useState<VendorSummaryDto[]>([])
  const [userSelections, setUserSelections] = useState<VendorPlanSelectionResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch vendor plans (using mock data for now)
  const fetchVendorPlans = async () => {
    try {
      setError(null)
      // For now, use mock data
      setVendorPlans(mockVendorPlans)
      
      // TODO: Uncomment when API is ready
      // const plans = await vendorPlanApi.fetchAll()
      // setVendorPlans(plans)
    } catch (err) {
      setError('Failed to fetch vendor plans')
      console.error('Error fetching vendor plans:', err)
    }
  }

  // Fetch vendors (using mock data for now)
  const fetchVendors = async () => {
    try {
      setError(null)
      // For now, use mock data
      setVendors(mockVendors)
      
      // TODO: Uncomment when API is ready
      // const vendorList = await vendorApi.fetchAll()
      // setVendors(vendorList)
    } catch (err) {
      setError('Failed to fetch vendors')
      console.error('Error fetching vendors:', err)
    }
  }

  // Fetch user's current selections
  const fetchUserSelections = async () => {
    if (!userId) return
    
    try {
      setError(null)
      // For now, use mock data for demonstration
      const mockUserSelection: VendorPlanSelectionResponseDto = {
        vendorPlanName: 'Full Meal Service',
        vendorName: 'Uniworld',
        selectedMonth: '2025-01-01',
        mealTypes: ['BREAKFAST', 'LUNCH', 'DINNER'],
        fee: 3500,
        roomNumber: 101,
        hostel: 'Uniworld_1'
      }
      setUserSelections([mockUserSelection])
      
      // TODO: Uncomment when API is ready
      // const selections = await vendorPlanSelectionApi.fetchByUser(userId)
      // setUserSelections(selections)
    } catch (err) {
      setError('Failed to fetch user selections')
      console.error('Error fetching user selections:', err)
    }
  }

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await Promise.all([
        fetchVendorPlans(),
        fetchVendors(),
        fetchUserSelections()
      ])
      setLoading(false)
    }

    initializeData()
  }, [userId])

  // Refresh all data
  const refreshData = async () => {
    setLoading(true)
    await Promise.all([
      fetchVendorPlans(),
      fetchVendors(),
      fetchUserSelections()
    ])
    setLoading(false)
  }

  return {
    vendorPlans,
    vendors,
    userSelections,
    loading,
    error,
    refreshData,
    fetchVendorPlans,
    fetchVendors,
    fetchUserSelections
  }
}
