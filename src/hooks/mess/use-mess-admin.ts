"use client"

import { useState, useEffect, useCallback } from 'react'
import { vendorApi, vendorPlanApi, feedbackApi, reviewApi } from '@/lib/api/mess'
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
      // For now, use mock data
      const mockVendors: VendorSummaryDto[] = [
        { vendorName: 'Uniworld' },
        { vendorName: 'GSR' },
        { vendorName: 'Other Vendor' }
      ]
      setVendors(mockVendors)
      
      // TODO: Uncomment when API is ready
      // const vendorData = await vendorApi.fetchAll()
      // setVendors(vendorData)
    } catch (err) {
      setError('Failed to fetch vendors')
      console.error('Error fetching vendors:', err)
    }
  }, [])

  // Fetch all vendor plans
  const fetchVendorPlans = useCallback(async () => {
    try {
      setError(null)
      // For now, use mock data
      const mockPlans: VendorPlanSummaryDto[] = [
        {
          planName: 'Daily Breakfast Service',
          vendorName: 'Uniworld',
          fee: 1000,
          mealTypes: ['BREAKFAST']
        },
        {
          planName: 'Full Meal Service',
          vendorName: 'Uniworld',
          fee: 3500,
          mealTypes: ['BREAKFAST', 'LUNCH', 'DINNER']
        },
        {
          planName: 'Lunch & Dinner',
          vendorName: 'GSR',
          fee: 2500,
          mealTypes: ['LUNCH', 'DINNER']
        },
        {
          planName: 'Premium Plan',
          vendorName: 'GSR',
          fee: 4000,
          mealTypes: ['BREAKFAST', 'LUNCH', 'DINNER']
        },
        {
          planName: 'Basic Plan',
          vendorName: 'Other Vendor',
          fee: 1500,
          mealTypes: ['LUNCH']
        }
      ]
      setVendorPlans(mockPlans)
      
      // TODO: Uncomment when API is ready
      // const planData = await vendorPlanApi.fetchAll()
      // setVendorPlans(planData)
    } catch (err) {
      setError('Failed to fetch vendor plans')
      console.error('Error fetching vendor plans:', err)
    }
  }, [])

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    try {
      setError(null)
      // For now, use mock data
      setFeedback([])
      
      // TODO: Implement when API is ready
      // const feedbackData = await feedbackApi.fetchAll()
      // setFeedback(feedbackData)
    } catch (err) {
      setError('Failed to fetch feedback')
      console.error('Error fetching feedback:', err)
    }
  }, [])

  // Fetch reviews data
  const fetchReviews = useCallback(async () => {
    try {
      setError(null)
      // For now, use mock data
      setReviews([])
      
      // TODO: Implement when API is ready
      // const reviewData = await reviewApi.fetchAll()
      // setReviews(reviewData)
    } catch (err) {
      setError('Failed to fetch reviews')
      console.error('Error fetching reviews:', err)
    }
  }, [])

  // Create new vendor
  const createVendor = useCallback(async (vendorData: VendorCreateDto): Promise<boolean> => {
    try {
      setError(null)
      // For now, just add to local state
      setVendors(prev => [...prev, { vendorName: vendorData.vendorName }])
      
      // TODO: Uncomment when API is ready
      // await vendorApi.create(vendorData)
      // await fetchVendors() // Refresh data
      
      return true
    } catch (err) {
      setError('Failed to create vendor')
      console.error('Error creating vendor:', err)
      return false
    }
  }, [])

  // Create new vendor plan
  const createVendorPlan = useCallback(async (planData: VendorPlanCreateDto): Promise<boolean> => {
    try {
      setError(null)
      // For now, just add to local state
      const vendor = vendors.find(v => v.vendorName === 'Uniworld') // Mock vendor selection
      if (vendor) {
        const newPlan: VendorPlanSummaryDto = {
          planName: planData.planName,
          vendorName: vendor.vendorName,
          fee: planData.fee,
          mealTypes: planData.mealTypes
        }
        setVendorPlans(prev => [...prev, newPlan])
      }
      
      // TODO: Uncomment when API is ready
      // await vendorPlanApi.create(planData)
      // await fetchVendorPlans() // Refresh data
      
      return true
    } catch (err) {
      setError('Failed to create vendor plan')
      console.error('Error creating vendor plan:', err)
      return false
    }
  }, [vendors])

  // Update vendor
  const updateVendor = useCallback(async (vendorName: string, updateData: Partial<VendorCreateDto>): Promise<boolean> => {
    try {
      setError(null)
      // For now, just update local state
      setVendors(prev => prev.map(vendor => 
        vendor.vendorName === vendorName 
          ? { ...vendor, ...updateData }
          : vendor
      ))
      
      // TODO: Uncomment when API is ready
      // await vendorApi.update(vendorName, updateData)
      // await fetchVendors() // Refresh data
      
      return true
    } catch (err) {
      setError('Failed to update vendor')
      console.error('Error updating vendor:', err)
      return false
    }
  }, [])

  // Delete vendor
  const deleteVendor = useCallback(async (vendorName: string): Promise<boolean> => {
    try {
      setError(null)
      // For now, just remove from local state
      setVendors(prev => prev.filter(vendor => vendor.vendorName !== vendorName))
      setVendorPlans(prev => prev.filter(plan => plan.vendorName !== vendorName))
      
      // TODO: Uncomment when API is ready
      // await vendorApi.delete(vendorName)
      // await fetchVendors() // Refresh data
      // await fetchVendorPlans() // Refresh plans
      
      return true
    } catch (err) {
      setError('Failed to delete vendor')
      console.error('Error deleting vendor:', err)
      return false
    }
  }, [])

  // Delete vendor plan
  const deleteVendorPlan = useCallback(async (planName: string, vendorName: string): Promise<boolean> => {
    try {
      setError(null)
      // For now, just remove from local state
      setVendorPlans(prev => prev.filter(plan => 
        !(plan.planName === planName && plan.vendorName === vendorName)
      ))
      
      // TODO: Uncomment when API is ready
      // await vendorPlanApi.delete(planId)
      // await fetchVendorPlans() // Refresh data
      
      return true
    } catch (err) {
      setError('Failed to delete vendor plan')
      console.error('Error deleting vendor plan:', err)
      return false
    }
  }, [])

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
