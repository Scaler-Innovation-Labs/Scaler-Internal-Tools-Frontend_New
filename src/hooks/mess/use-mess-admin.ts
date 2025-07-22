"use client"

import { useState, useEffect, useCallback } from 'react'
import { vendorAdminApi, vendorPlanAdminApi, feedbackApi, reviewApi } from '@/lib/api/mess'
import type { 
  VendorSummaryDto,
  VendorPlanSummaryDto,
  VendorCreateDto,
  VendorPlanCreateDto,
  FeedbackResponseDto,
  ReviewResponseDto
} from '@/types/mess'

export function useMessAdmin() {
  const [vendors, setVendors] = useState<VendorSummaryDto[]>([])
  const [vendorPlans, setVendorPlans] = useState<VendorPlanSummaryDto[]>([])
  const [feedback, setFeedback] = useState<FeedbackResponseDto[]>([])
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all vendors
  const fetchVendors = useCallback(async () => {
    try {
      setError(null)
      const vendorData = await vendorAdminApi.fetchAll()
      setVendors(vendorData)
    } catch (err) {
      setError('Failed to fetch vendors')
      console.error('Error fetching vendors:', err)
    }
  }, [])

  // Fetch all vendor plans
  const fetchVendorPlans = useCallback(async () => {
    try {
      setError(null)
      const planData = await vendorPlanAdminApi.fetchAll()
      setVendorPlans(planData)
    } catch (err) {
      setError('Failed to fetch vendor plans')
      console.error('Error fetching vendor plans:', err)
    }
  }, [])

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    try {
      setError(null)
      // Since there's no fetchAll for feedback, we'll need to fetch by vendor
      // This would need to be updated based on actual requirements
      setFeedback([])
      
      // TODO: Implement proper feedback fetching based on requirements
      // For example, fetch feedback for all vendors or specific criteria
    } catch (err) {
      setError('Failed to fetch feedback')
      console.error('Error fetching feedback:', err)
    }
  }, [])

  // Fetch reviews data
  const fetchReviews = useCallback(async () => {
    try {
      setError(null)
      // Since there's no fetchAll for reviews, we'll need to fetch by vendor
      // This would need to be updated based on actual requirements
      setReviews([])
      
      // TODO: Implement proper reviews fetching based on requirements
      // For example, fetch reviews for all vendors or specific criteria
    } catch (err) {
      setError('Failed to fetch reviews')
      console.error('Error fetching reviews:', err)
    }
  }, [])

  // Create new vendor
  const createVendor = useCallback(async (vendorData: VendorCreateDto): Promise<boolean> => {
    try {
      setError(null)
      await vendorAdminApi.create(vendorData)
      await fetchVendors() // Refresh data
      return true
    } catch (err) {
      setError('Failed to create vendor')
      console.error('Error creating vendor:', err)
      return false
    }
  }, [fetchVendors])

  // Create new vendor plan
  const createVendorPlan = useCallback(async (planData: VendorPlanCreateDto): Promise<boolean> => {
    try {
      setError(null)
      await vendorPlanAdminApi.create(planData)
      await fetchVendorPlans() // Refresh data
      return true
    } catch (err) {
      setError('Failed to create vendor plan')
      console.error('Error creating vendor plan:', err)
      return false
    }
  }, [fetchVendorPlans])

  // Update vendor
  const updateVendor = useCallback(async (vendorId: number, updateData: Partial<VendorCreateDto>): Promise<boolean> => {
    try {
      setError(null)
      await vendorAdminApi.update(vendorId, updateData)
      await fetchVendors() // Refresh data
      return true
    } catch (err) {
      setError('Failed to update vendor')
      console.error('Error updating vendor:', err)
      return false
    }
  }, [fetchVendors])

  // Delete vendor
  const deleteVendor = useCallback(async (vendorId: number): Promise<boolean> => {
    try {
      setError(null)
      await vendorAdminApi.delete(vendorId)
      await fetchVendors() // Refresh data
      await fetchVendorPlans() // Refresh plans
      return true
    } catch (err) {
      setError('Failed to delete vendor')
      console.error('Error deleting vendor:', err)
      return false
    }
  }, [fetchVendors, fetchVendorPlans])

  // Delete vendor plan
  const deleteVendorPlan = useCallback(async (planId: number): Promise<boolean> => {
    try {
      setError(null)
      await vendorPlanAdminApi.delete(planId)
      await fetchVendorPlans() // Refresh data
      return true
    } catch (err) {
      setError('Failed to delete vendor plan')
      console.error('Error deleting vendor plan:', err)
      return false
    }
  }, [fetchVendorPlans])

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      console.log('useMessAdmin: Initializing data...')
      setLoading(true)
      await Promise.all([
        fetchVendors(),
        fetchVendorPlans(),
        fetchFeedback(),
        fetchReviews()
      ])
      setLoading(false)
      console.log('useMessAdmin: Data initialized')
    }

    initializeData()
  }, [fetchVendors, fetchVendorPlans, fetchFeedback, fetchReviews])

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true)
    await Promise.all([
      fetchVendors(),
      fetchVendorPlans(),
      fetchFeedback(),
      fetchReviews()
    ])
    setLoading(false)
  }, [fetchVendors, fetchVendorPlans, fetchFeedback, fetchReviews])

  return {
    // Data
    vendors,
    vendorPlans,
    feedback,
    reviews,
    loading,
    error,
    
    // Actions
    createVendor,
    createVendorPlan,
    updateVendor,
    deleteVendor,
    deleteVendorPlan,
    refreshData,
    
    // Fetch functions
    fetchVendors,
    fetchVendorPlans,
    fetchFeedback,
    fetchReviews
  }
}
