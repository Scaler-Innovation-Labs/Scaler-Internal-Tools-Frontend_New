// Mess Feature Types

// Vendor Types
export interface Vendor {
  vendorId: number;
  vendorName: string;
}

export interface VendorCreateDto {
  vendorName: string;
}

export interface VendorUpdateDto {
  vendorName: string;
}

export interface VendorResponseDto {
  vendorId: number;
  vendorName: string;
}

export interface VendorSummaryDto {
  vendorName: string;
}

// Vendor Plan Types
export interface VendorPlan {
  vendorPlanId: number;
  planName: string;
  vendorId: number;
  fee: number;
  mealTypes: string[];
}

export interface VendorPlanCreateDto {
  planName: string;
  vendorId: number;
  fee: number;
  mealTypes: string[];
}

export interface VendorPlanUpdateDto {
  planName?: string;
  fee?: number;
}

export interface VendorPlanResponseDto {
  vendorPlanId: number;
  planName: string;
  vendorId: number;
  fee: number;
  mealTypes: string[];
}

export interface VendorPlanSummaryDto {
  planName: string;
  vendorName: string;
  fee: number;
  mealTypes: string[];
}

// Vendor Plan Selection Types
export interface VendorPlanSelection {
  vendorPlanSelectionId: number;
  userId: number;
  vendorPlanId: number;
  selectedMonth: string; // LocalDate as ISO string
  roomNumber: number;
  hostel: string;
}

export interface VendorPlanSelectionCreateDto {
  vendorPlanId: number;
  userId: number;
  selectedMonth: string; // LocalDate as ISO string
  roomNumber: number;
  hostel: string;
}

export interface VendorPlanSelectionUpdateDto {
  vendorPlanId?: number;
  selectedMonth?: string;
  roomNumber?: number;
  hostel?: string;
}

export interface VendorPlanSelectionResponseDto {
  vendorPlanSelectionId: number;
  userId: number;
  vendorPlanId: number;
  selectedMonth: string;
  roomNumber: number;
  hostel: string;
}

export interface VendorPlanSelectionSummaryDto {
  vendorPlanName: string;
  vendorName: string;
  selectedMonth: string;
  mealTypes: string[];
  fee: number;
  roomNumber: number;
  hostel: string;
}

// Vendor Plan History Types (for admin)
export interface VendorPlanHistorySummaryDto {
  planName: string;
  vendorName: string;
  fee: number;
  mealTypes: string[];
}

export interface VendorPlanSelectionHistoryDto {
  userId: number;
  vendorPlanHistorySummaryDto: VendorPlanHistorySummaryDto;
  selectedMonth: string;
  roomNumber: number;
  hostel: string;
}

// Feedback and Review Types
export interface FeedbackCreateDto {
  vendorPlanId: number;
  userId: number;
  feedback: string;
}

export interface FeedbackResponseDto {
  vendorPlanId: number;
  userId: number;
  feedback: string;
  timestamp: string;
}

export interface ReviewCreateDto {
  vendorPlanId: number;
  userId: number;
  review: string;
  rating: number;
}

export interface ReviewResponseDto {
  vendorPlanId: number;
  userId: number;
  review: string;
  rating: number;
  timestamp: string;
}

// Enums
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';
export type HostelType = 'Uniworld_1' | 'Uniworld_2';

// Page Types for API responses
export interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

// Cart Types for UI
export interface CartItem {
  vendorName: string;
  planName: string;
  fee: number;
  vendorPlanId: number;
  mealTypes: string[];
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

// UI State Types
export interface DietPreference {
  type: 'Veg' | 'Non Veg' | 'Egg';
  selected: boolean;
}

export interface CheckoutDetails {
  dietPreference: DietPreference[];
  roomNumber: string;
  sstMail: string;
}

// Quick Stats Types
export interface QuickStats {
  selectedPlan: string;
  planPeriod: string;
  dietPreferences: string[];
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
}

// Feedback Types
export interface MessFeedback {
  rating: number;
  additionalFeedback?: string;
}
