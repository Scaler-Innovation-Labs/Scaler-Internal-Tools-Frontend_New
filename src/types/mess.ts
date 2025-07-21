// Mess API Types

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER'
export type HostelType = 'Uniworld_1' | 'Uniworld_2'

// Vendor Types
export interface VendorSummaryDto {
  vendorName: string
}

export interface VendorCreateDto {
  vendorName: string
}

export interface VendorUpdateDto {
  vendorName: string
}

export interface VendorResponseDto {
  vendorId: number
  vendorName: string
}

// Vendor Plan Types
export interface VendorPlanSummaryDto {
  planName: string
  vendorName: string
  fee: number
  mealTypes: MealType[]
}

export interface VendorPlanCreateDto {
  planName: string
  vendorId: number
  fee: number
  mealTypes: MealType[]
}

export interface VendorPlanUpdateDto {
  planName?: string
  fee?: number
  mealTypes?: MealType[]
}

export interface VendorPlanResponseDto {
  vendorPlanId: number
  planName: string
  vendorId: number
  fee: number
  mealTypes: MealType[]
}

// Vendor Plan Selection Types
export interface VendorPlanSelectionCreateDto {
  vendorPlanId: number
  userId: number
  selectedMonth: string // YYYY-MM-DD format
  roomNumber: number
  hostel: HostelType
}

export interface VendorPlanSelectionResponseDto {
  vendorPlanName: string
  vendorName: string
  selectedMonth: string
  mealTypes: MealType[]
  fee: number
  roomNumber: number
  hostel: HostelType
}

export interface VendorPlanHistoryDto {
  userId: number
  vendorPlanHistorySummaryDto: VendorPlanSummaryDto
  selectedMonth: string
  roomNumber: number
  hostel: HostelType
}

// Feedback Types
export interface FeedbackCreateDto {
  vendorPlanId: number
  userId: number
  feedback: string
}

export interface FeedbackResponseDto {
  vendorPlanId: number
  userId: number
  feedback: string
  timestamp: string
}

// Review Types
export interface ReviewCreateDto {
  vendorPlanId: number
  userId: number
  review: string
  rating: number
}

export interface ReviewResponseDto {
  vendorPlanId: number
  userId: number
  review: string
  rating?: number
  timestamp: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
