import { config } from '@/lib/configs'
import type {
  VendorSummaryDto,
  VendorPlanSummaryDto,
  VendorPlanSelectionCreateDto,
  VendorPlanSelectionResponseDto,
  VendorPlanHistoryDto,
  FeedbackCreateDto,
  FeedbackResponseDto,
  ReviewCreateDto,
  ReviewResponseDto,
  PaginatedResponse
} from '@/types/mess'

const MESS_API_BASE = '/mess'

// Helper function to make API calls with full URL
const apiCall = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${config.api.backendUrl}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`)
  }

  return response.json()
}

// Vendor Plan API (User)
export const vendorPlanApi = {
  // Get all vendor plans available for selection
  fetchAll: async (): Promise<VendorPlanSummaryDto[]> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/fetchAll`)
  },

  fetchById: async (id: number): Promise<VendorPlanSummaryDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/fetch/${id}`)
  }
}

// Vendor Plan Selection API (User)
export const vendorPlanSelectionApi = {
  // Get user's current selections
  fetchByUser: async (userId: number): Promise<VendorPlanSelectionResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/vendorPlanSelection/fetchByUser/${userId}`)
  },

  // Get user's selections filtered by vendor
  fetchByUserAndVendor: async (userId: number, vendorId: number): Promise<VendorPlanSelectionResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/vendorPlanSelection/fetchByUserAndVendor/${userId}/${vendorId}`)
  },

  // Create new vendor plan selection
  create: async (userId: number, selections: VendorPlanSelectionCreateDto[]): Promise<VendorPlanSelectionResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/vendorPlanSelection/create/${userId}`, {
      method: 'POST',
      body: JSON.stringify(selections)
    })
  },

  // Update vendor plan selection
  update: async (userId: number, selections: VendorPlanSelectionCreateDto[]): Promise<VendorPlanSelectionResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/vendorPlanSelection/update/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(selections)
    })
  },

  // Get user's selection history
  fetchHistory: async (userId: number): Promise<VendorPlanHistoryDto[]> => {
    return apiCall(`${MESS_API_BASE}/vendorPlanSelection/history/${userId}`)
  },

  // Get user's selection history by month
  fetchHistoryByMonth: async (userId: number, month: number, year: number): Promise<VendorPlanHistoryDto[]> => {
    return apiCall(`${MESS_API_BASE}/vendorPlanSelection/historyByMonth/${userId}?month=${month}&year=${year}`)
  }
}

// Feedback API
export const feedbackApi = {
  // Create feedback
  create: async (feedback: FeedbackCreateDto): Promise<FeedbackResponseDto> => {
    return apiCall(`${MESS_API_BASE}/feedback/create`, {
      method: 'POST',
      body: JSON.stringify(feedback)
    })
  },

  // Get feedback by vendor
  fetchByVendor: async (vendorId: number): Promise<FeedbackResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/feedback/fetchByVendor/${vendorId}`)
  },

  // Get feedback by vendor and user
  fetchByVendorAndUser: async (vendorId: number, userId: number): Promise<FeedbackResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/feedback/fetchByVendorAndUser/${vendorId}/${userId}`)
  }
}

// Review API
export const reviewApi = {
  // Create review
  create: async (review: ReviewCreateDto): Promise<ReviewResponseDto> => {
    return apiCall(`${MESS_API_BASE}/review/create`, {
      method: 'POST',
      body: JSON.stringify(review)
    })
  },

  // Get reviews by vendor
  fetchByVendor: async (vendorId: number): Promise<ReviewResponseDto[]> => {
    return apiCall(`${MESS_API_BASE}/review/fetchByVendor/${vendorId}`)
  },

  // Delete review
  delete: async (reviewId: number): Promise<string> => {
    return apiCall(`${MESS_API_BASE}/review/delete/${reviewId}`, {
      method: 'DELETE'
    })
  },

  // Bookmark review
  bookmark: async (reviewId: number): Promise<string> => {
    return apiCall(`${MESS_API_BASE}/review/bookmark/${reviewId}`, {
      method: 'POST'
    })
  }
}

// Vendor API (for getting vendor info)
export const vendorApi = {
  fetchAll: async (): Promise<VendorSummaryDto[]> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/fetchAll`)
  },

  fetchById: async (id: number): Promise<VendorSummaryDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/fetch/${id}`)
  }
}

// Admin Vendor API (for admin-only vendor management)
export const vendorAdminApi = {
  // Get all vendors (admin only)
  fetchAll: async (): Promise<VendorSummaryDto[]> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/fetchAll`)
  },

  // Get vendor by ID (admin only)
  fetchById: async (id: number): Promise<VendorSummaryDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/fetch/${id}`)
  },

  // Create new vendor (admin only)
  create: async (vendor: VendorCreateDto): Promise<VendorResponseDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/create`, {
      method: 'POST',
      body: JSON.stringify(vendor)
    })
  },

  // Update vendor (admin only)
  update: async (vendorId: number, vendor: VendorUpdateDto): Promise<VendorResponseDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/update/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(vendor)
    })
  },

  // Delete vendor (admin only)
  delete: async (vendorId: number): Promise<string> => {
    return apiCall(`${MESS_API_BASE}/admin/vendor/delete/${vendorId}`, {
      method: 'DELETE'
    })
  }
}

// Admin Vendor Plan API (for admin-only vendor plan management)
export const vendorPlanAdminApi = {
  // Get all vendor plans (admin only)
  fetchAll: async (): Promise<VendorPlanSummaryDto[]> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/fetchAll`)
  },

  // Get vendor plan by ID (admin only)
  fetchById: async (id: number): Promise<VendorPlanSummaryDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/fetch/${id}`)
  },

  // Create new vendor plan (admin only)
  create: async (plan: VendorPlanCreateDto): Promise<VendorPlanResponseDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/create`, {
      method: 'POST',
      body: JSON.stringify(plan)
    })
  },

  // Update vendor plan (admin only)
  update: async (planId: number, plan: VendorPlanUpdateDto): Promise<VendorPlanResponseDto> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/update/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(plan)
    })
  },

  // Delete vendor plan (admin only)
  delete: async (planId: number): Promise<string> => {
    return apiCall(`${MESS_API_BASE}/admin/vendorPlan/delete/${planId}`, {
      method: 'DELETE'
    })
  }
}
