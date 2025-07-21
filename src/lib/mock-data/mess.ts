// Mock data for testing mess functionality
import type { VendorPlanSummaryDto, VendorSummaryDto } from '@/types/mess'

export const mockVendors: VendorSummaryDto[] = [
  { vendorName: 'Uniworld' },
  { vendorName: 'GSR' },
  { vendorName: 'Other Vendor' }
]

export const mockVendorPlans: VendorPlanSummaryDto[] = [
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
