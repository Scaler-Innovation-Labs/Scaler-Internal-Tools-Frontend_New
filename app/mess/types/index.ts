// Mess Feature Types

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
  mealTypes: Set<string>;
}

export interface VendorPlanCreateDto {
  planName: string;
  vendorId: number;
  fee: number;
  mealTypes: Set<string>;
}

export interface VendorPlanUpdateDto {
  planName: string;
  fee: number;
}

export interface VendorPlanResponseDto {
  vendorPlanId: number;
  planName: string;
  vendorId: number;
  fee: number;
  mealTypes: Set<string>;
}

export interface VendorPlanSummaryDto {
  planName: string;
  vendorName: string;
  fee: number;
  mealTypes: Set<string>;
}

// Vendor Plan Selection Types
export interface VendorPlanSelection {
  vendorPlanSelectionId: number;
  userId: number;
  vendorPlanId: number;
  selectedMonth: string; // LocalDate as ISO string
}

export interface VendorPlanSelectionCreateDto {
  vendorPlanId: number;
  userId: number;
  selectedMonth: string; // LocalDate as ISO string
}

export interface VendorPlanSelectionUpdateDto {
  planId: number;
}

export interface VendorPlanSelectionResponseDto {
  vendorPlanSelectionId: number;
  userId: number;
  vendorPlanId: number;
  selectedMonth: string;
}

export interface VendorPlanSelectionSummaryDto {
  vendorPlanName: string;
  vendorName: string;
  selectedMonth: string;
  mealTypes: Set<string>;
  fee: number;
}

// Cart Types for UI
export interface CartItem {
  vendorName: string;
  planName: string;
  fee: number;
  vendorPlanId: number;
  mealTypes: Set<string>;
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
