import type {
  Vendor,
  VendorCreateDto,
  VendorUpdateDto,
  VendorResponseDto,
  VendorSummaryDto,
  VendorPlan,
  VendorPlanCreateDto,
  VendorPlanUpdateDto,
  VendorPlanResponseDto,
  VendorPlanSummaryDto,
  VendorPlanSelection,
  VendorPlanSelectionCreateDto,
  VendorPlanSelectionUpdateDto,
  VendorPlanSelectionResponseDto,
  VendorPlanSelectionSummaryDto,
  VendorPlanSelectionHistoryDto,
  FeedbackCreateDto,
  FeedbackResponseDto,
  ReviewCreateDto,
  ReviewResponseDto,
  Page
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create API factory that takes fetchWithAuth function
export const createMessApi = (fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>) => {
  
  // Vendor API (Admin only)
  const vendorApi = {
    fetch: async (id: number): Promise<VendorSummaryDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/fetch/${id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
      return response.json();
    },

    fetchAll: async (): Promise<VendorSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/fetchAll`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },

    create: async (vendor: VendorCreateDto): Promise<VendorResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor)
      });
      if (!response.ok) throw new Error('Failed to create vendor');
      return response.json();
    },

    update: async (id: number, vendor: VendorUpdateDto): Promise<VendorResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor)
      });
      if (!response.ok) throw new Error('Failed to update vendor');
      return response.json();
    },

    delete: async (id: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor');
      return response.text();
    }
  };

  // Vendor Plan API (Admin only)
  const vendorPlanApi = {
    fetch: async (id: number): Promise<VendorPlanSummaryDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/fetch/${id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor plan');
      return response.json();
    },

    fetchAll: async (): Promise<VendorPlanSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/fetchAll`);
      if (!response.ok) throw new Error('Failed to fetch vendor plans');
      return response.json();
    },

    create: async (plan: VendorPlanCreateDto): Promise<VendorPlanResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (!response.ok) throw new Error('Failed to create vendor plan');
      return response.json();
    },

    update: async (id: number, plan: VendorPlanUpdateDto): Promise<VendorPlanResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (!response.ok) throw new Error('Failed to update vendor plan');
      return response.json();
    },

    partialUpdate: async (id: number, plan: Partial<VendorPlanUpdateDto>): Promise<VendorPlanResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/partialUpdate/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      if (!response.ok) throw new Error('Failed to update vendor plan');
      return response.json();
    },

    delete: async (id: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor plan');
      return response.text();
    }
  };

  // Vendor Plan Selection API (Admin)
  const adminVendorPlanSelectionApi = {
    createForUser: async (userId: number, selections: VendorPlanSelectionCreateDto[]): Promise<VendorPlanSelectionResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/create/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections)
      });
      if (!response.ok) throw new Error('Failed to create vendor plan selection');
      return response.json();
    },

    updateForUser: async (userId: number, selections: VendorPlanSelectionCreateDto[]): Promise<VendorPlanSelectionResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections)
      });
      if (!response.ok) throw new Error('Failed to update vendor plan selection');
      return response.json();
    },

    deleteForUser: async (userId: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/delete/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor plan selection');
      return response.text();
    },

    // History endpoints
    getHistoryByMonthAndVendorPlan: async (month: number, year: number, vendorPlan: string, page = 0, size = 10): Promise<Page<VendorPlanSelectionHistoryDto>> => {
      const params = new URLSearchParams({ 
        month: month.toString(), 
        year: year.toString(), 
        vendorPlan, 
        page: page.toString(), 
        size: size.toString() 
      });
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/historyByMonthAndVendorPlanName?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },

    getHistoryByMonthAndVendor: async (month: number, year: number, vendorName: string, page = 0, size = 10): Promise<Page<VendorPlanSelectionHistoryDto>> => {
      const params = new URLSearchParams({ 
        month: month.toString(), 
        year: year.toString(), 
        vendorName, 
        page: page.toString(), 
        size: size.toString() 
      });
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/historyByMonthAndVendorName?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },

    getHistoryByMonth: async (month: number, year: number, page = 0, size = 10): Promise<Page<VendorPlanSelectionHistoryDto>> => {
      const params = new URLSearchParams({ 
        month: month.toString(), 
        year: year.toString(), 
        page: page.toString(), 
        size: size.toString() 
      });
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/historyByMonth?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },

    getAllHistory: async (page = 0, size = 10): Promise<Page<VendorPlanSelectionHistoryDto>> => {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/history?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },

    getHistoryByHostel: async (hostel: string, page = 0, size = 10): Promise<Page<VendorPlanSelectionHistoryDto>> => {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/historyByHostel/${hostel}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    }
  };

  // Vendor Plan Selection API (User)
  const userVendorPlanSelectionApi = {
    fetchByUser: async (userId: number): Promise<VendorPlanSelectionSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/fetchByUser/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user vendor plan selections');
      return response.json();
    },

    fetchByUserAndVendor: async (userId: number, vendorId: number): Promise<VendorPlanSelectionSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/fetchByUserAndVendor/${userId}/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch user vendor plan selections');
      return response.json();
    },

    create: async (userId: number, selections: VendorPlanSelectionCreateDto[]): Promise<VendorPlanSelectionResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/create/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections)
      });
      if (!response.ok) throw new Error('Failed to create vendor plan selection');
      return response.json();
    },

    update: async (userId: number, selections: VendorPlanSelectionCreateDto[]): Promise<VendorPlanSelectionResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections)
      });
      if (!response.ok) throw new Error('Failed to update vendor plan selection');
      return response.json();
    },

    getHistory: async (userId: number): Promise<VendorPlanSelectionSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/history/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user history');
      return response.json();
    },

    getHistoryByMonth: async (userId: number, month: number, year: number): Promise<VendorPlanSelectionSummaryDto[]> => {
      const params = new URLSearchParams({ month: month.toString(), year: year.toString() });
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/historyByMonth/${userId}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch user history by month');
      return response.json();
    }
  };

  // PDF Export API (Admin only)
  const exportApi = {
    downloadStudentOptInPDF: async (hostel: string): Promise<Blob> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/downloadStudentOptInPDF/${hostel}`);
      if (!response.ok) throw new Error('Failed to download PDF');
      return response.blob();
    }
  };

  // Feedback API
  const feedbackApi = {
    create: async (feedback: FeedbackCreateDto): Promise<FeedbackResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/feedback/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      if (!response.ok) throw new Error('Failed to create feedback');
      return response.json();
    },

    fetchByVendor: async (vendorId: number): Promise<FeedbackResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/feedback/fetchByVendor/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch feedback');
      return response.json();
    },

    fetchByVendorAndUser: async (vendorId: number, userId: number): Promise<FeedbackResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/feedback/fetchByVendorAndUser/${vendorId}/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch feedback');
      return response.json();
    },

    downloadExcel: async (month: string): Promise<Blob> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/feedback/downloadExcel/${month}`);
      if (!response.ok) throw new Error('Failed to download excel');
      return response.blob();
    }
  };

  // Review API
  const reviewApi = {
    create: async (review: ReviewCreateDto): Promise<ReviewResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/review/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (!response.ok) throw new Error('Failed to create review');
      return response.json();
    },

    fetchByVendor: async (vendorId: number): Promise<ReviewResponseDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/review/fetchByVendor/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },

    delete: async (reviewId: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/review/delete/${reviewId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete review');
      return response.text();
    },

    bookmark: async (reviewId: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/review/bookmark/${reviewId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to bookmark review');
      return response.text();
    }
  };

  return {
    vendorApi,
    vendorPlanApi,
    adminVendorPlanSelectionApi,
    userVendorPlanSelectionApi,
    exportApi,
    feedbackApi,
    reviewApi
  };
};

// Mock API for development/testing
export const createMockMessApi = () => {
  // Mock data
  const mockVendors: VendorSummaryDto[] = [
    { vendorName: 'Uniworld' },
    { vendorName: 'GSR' },
    { vendorName: 'Jain Food' }
  ];

  const mockVendorPlans: VendorPlanSummaryDto[] = [
    {
      planName: 'Daily Breakfast Service',
      vendorName: 'Uniworld',
      fee: 1000,
      mealTypes: ['BREAKFAST']
    },
    {
      planName: 'Full Meal Service',
      vendorName: 'Uniworld',
      fee: 4000,
      mealTypes: ['BREAKFAST', 'LUNCH', 'DINNER']
    },
    {
      planName: 'Lunch & Dinner',
      vendorName: 'GSR',
      fee: 3500,
      mealTypes: ['LUNCH', 'DINNER']
    }
  ];

  const mockUserSelections: VendorPlanSelectionSummaryDto[] = [
    {
      vendorPlanName: 'Full Meal Service',
      vendorName: 'Uniworld',
      selectedMonth: '2025-06-01',
      mealTypes: ['BREAKFAST', 'LUNCH', 'DINNER'],
      fee: 4000,
      roomNumber: 101,
      hostel: 'Uniworld_1'
    }
  ];

  const emptyPage = <T,>(): Page<T> => ({
    content: [], 
    totalElements: 0, 
    totalPages: 0, 
    size: 10, 
    number: 0,
    pageable: { pageNumber: 0, pageSize: 10, offset: 0, sort: { sorted: false, unsorted: true, empty: true }, paged: true, unpaged: false },
    last: true,
    first: true,
    numberOfElements: 0,
    sort: { sorted: false, unsorted: true, empty: true },
    empty: true
  });

  // Return mock API matching the real API structure
  return {
    vendorApi: {
      fetch: async (id: number) => mockVendors[0],
      fetchAll: async () => mockVendors,
      create: async (vendor: VendorCreateDto) => ({ vendorId: Date.now(), ...vendor }),
      update: async (id: number, vendor: VendorUpdateDto) => ({ vendorId: id, ...vendor }),
      delete: async (id: number) => 'Deleted vendor successfully'
    },
    vendorPlanApi: {
      fetch: async (id: number) => mockVendorPlans[0],
      fetchAll: async () => mockVendorPlans,
      create: async (plan: VendorPlanCreateDto) => ({ vendorPlanId: Date.now(), ...plan }),
      update: async (id: number, plan: VendorPlanUpdateDto) => ({ vendorPlanId: id, planName: plan.planName || '', vendorId: 1, fee: plan.fee || 0, mealTypes: [] }),
      partialUpdate: async (id: number, plan: Partial<VendorPlanUpdateDto>) => ({ vendorPlanId: id, planName: plan.planName || '', vendorId: 1, fee: plan.fee || 0, mealTypes: [] }),
      delete: async (id: number) => 'Vendor plan deleted successfully'
    },
    adminVendorPlanSelectionApi: {
      createForUser: async (userId: number, selections: VendorPlanSelectionCreateDto[]) => 
        selections.map(s => ({ vendorPlanSelectionId: Date.now(), ...s })),
      updateForUser: async (userId: number, selections: VendorPlanSelectionCreateDto[]) => 
        selections.map(s => ({ vendorPlanSelectionId: Date.now(), ...s })),
      deleteForUser: async (userId: number) => 'Vendor Plan Selection Deleted',
      getHistoryByMonthAndVendorPlan: async () => emptyPage<VendorPlanSelectionHistoryDto>(),
      getHistoryByMonthAndVendor: async () => emptyPage<VendorPlanSelectionHistoryDto>(),
      getHistoryByMonth: async () => emptyPage<VendorPlanSelectionHistoryDto>(),
      getAllHistory: async () => emptyPage<VendorPlanSelectionHistoryDto>(),
      getHistoryByHostel: async () => emptyPage<VendorPlanSelectionHistoryDto>()
    },
    userVendorPlanSelectionApi: {
      fetchByUser: async (userId: number) => mockUserSelections,
      fetchByUserAndVendor: async (userId: number, vendorId: number) => mockUserSelections,
      create: async (userId: number, selections: VendorPlanSelectionCreateDto[]) => 
        selections.map(s => ({ vendorPlanSelectionId: Date.now(), ...s })),
      update: async (userId: number, selections: VendorPlanSelectionCreateDto[]) => 
        selections.map(s => ({ vendorPlanSelectionId: Date.now(), ...s })),
      getHistory: async (userId: number) => mockUserSelections,
      getHistoryByMonth: async (userId: number, month: number, year: number) => mockUserSelections
    },
    exportApi: {
      downloadStudentOptInPDF: async (hostel: string) => new Blob(['mock pdf content'], { type: 'application/pdf' })
    },
    feedbackApi: {
      create: async (feedback: FeedbackCreateDto) => ({ ...feedback, timestamp: new Date().toISOString() }),
      fetchByVendor: async (vendorId: number) => [],
      fetchByVendorAndUser: async (vendorId: number, userId: number) => [],
      downloadExcel: async (month: string) => new Blob(['mock excel content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    },
    reviewApi: {
      create: async (review: ReviewCreateDto) => ({ ...review, timestamp: new Date().toISOString() }),
      fetchByVendor: async (vendorId: number) => [],
      delete: async (reviewId: number) => 'Review deleted successfully',
      bookmark: async (reviewId: number) => 'Review bookmarked successfully'
    }
  };
};
