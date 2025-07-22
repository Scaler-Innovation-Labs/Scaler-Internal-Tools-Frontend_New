"use client"

import { useState, useEffect } from 'react'
import { vendorPlanApi, vendorPlanSelectionApi, vendorApi } from '@/lib/api/mess'
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

  // Fetch vendor plans
  const fetchVendorPlans = async () => {
    try {
      setError(null)
      const plans = await vendorPlanApi.fetchAll()
      setVendorPlans(plans)
    } catch (err) {
      setError('Failed to fetch vendor plans')
      console.error('Error fetching vendor plans:', err)
    }
  }

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      setError(null)
      const vendorList = await vendorApi.fetchAll()
      setVendors(vendorList)
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
      const selections = await vendorPlanSelectionApi.fetchByUser(userId)
      setUserSelections(selections)
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
