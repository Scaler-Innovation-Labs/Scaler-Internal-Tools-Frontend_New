import type {
  VendorCreateDto,
  VendorUpdateDto,
  VendorResponseDto,
  VendorSummaryDto,
  VendorPlanCreateDto,
  VendorPlanUpdateDto,
  VendorPlanResponseDto,
  VendorPlanSummaryDto,
  VendorPlanSelectionResponseDto,
  VendorPlanSelectionSummaryDto
} from '../../mess/types';
import type {
  MessStats,
  VendorWithStats,
  PlanWithDetails,
  StudentSelection,
  MessAnalytics
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create Admin API factory that takes fetchWithAuth function
export const createMessAdminApi = (fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>) => {
  
  // Admin Dashboard API
  const dashboardApi = {
    getStats: async (): Promise<MessStats> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch mess stats');
      return response.json();
    },

    getAnalytics: async (startDate: string, endDate: string): Promise<MessAnalytics> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/dashboard/analytics?start=${startDate}&end=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    }
  };

  // Vendor Management API (Admin)
  const vendorAdminApi = {
    fetchAll: async (): Promise<VendorWithStats[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/fetchAllWithStats`);
      if (!response.ok) throw new Error('Failed to fetch vendors with stats');
      return response.json();
    },

    fetch: async (id: number): Promise<VendorSummaryDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/fetch/${id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
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

    delete: async (id: number): Promise<void> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor');
    },

    toggleStatus: async (id: number, status: 'active' | 'inactive'): Promise<VendorResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendor/toggleStatus/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to toggle vendor status');
      return response.json();
    }
  };

  // Vendor Plan Management API (Admin)
  const planAdminApi = {
    fetchAll: async (): Promise<PlanWithDetails[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/fetchAllWithDetails`);
      if (!response.ok) throw new Error('Failed to fetch plans with details');
      return response.json();
    },

    fetchByVendor: async (vendorId: number): Promise<PlanWithDetails[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/fetchByVendor/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch vendor plans');
      return response.json();
    },

    fetch: async (id: number): Promise<VendorPlanSummaryDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/fetch/${id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor plan');
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

    delete: async (id: number): Promise<void> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor plan');
    },

    toggleStatus: async (id: number, status: 'active' | 'inactive'): Promise<VendorPlanResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlan/toggleStatus/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to toggle plan status');
      return response.json();
    }
  };

  // Student Selection Management API (Admin)
  const selectionAdminApi = {
    fetchAll: async (): Promise<StudentSelection[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/fetchAllWithDetails`);
      if (!response.ok) throw new Error('Failed to fetch student selections');
      return response.json();
    },

    fetchByStudent: async (userId: number): Promise<VendorPlanSelectionSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/fetchByUser/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user selections');
      return response.json();
    },

    fetchByPlan: async (planId: number): Promise<StudentSelection[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/fetchByPlan/${planId}`);
      if (!response.ok) throw new Error('Failed to fetch plan selections');
      return response.json();
    },

    fetchByVendor: async (vendorId: number): Promise<StudentSelection[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/fetchByVendor/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch vendor selections');
      return response.json();
    },

    cancelSelection: async (selectionId: number): Promise<void> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/cancel/${selectionId}`, {
        method: 'PATCH'
      });
      if (!response.ok) throw new Error('Failed to cancel selection');
    },

    exportSelections: async (format: 'csv' | 'excel', filters?: any): Promise<Blob> => {
      const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/export/${format}${query}`);
      if (!response.ok) throw new Error('Failed to export selections');
      return response.blob();
    }
  };

  // Report Generation API
  const reportApi = {
    generateVendorReport: async (vendorId: number, month: string): Promise<Blob> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/reports/vendor/${vendorId}?month=${month}`);
      if (!response.ok) throw new Error('Failed to generate vendor report');
      return response.blob();
    },

    generateRevenueReport: async (startDate: string, endDate: string): Promise<Blob> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/reports/revenue?start=${startDate}&end=${endDate}`);
      if (!response.ok) throw new Error('Failed to generate revenue report');
      return response.blob();
    },

    generateStudentReport: async (month: string): Promise<Blob> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/reports/students?month=${month}`);
      if (!response.ok) throw new Error('Failed to generate student report');
      return response.blob();
    }
  };

  return {
    dashboard: dashboardApi,
    vendors: vendorAdminApi,
    plans: planAdminApi,
    selections: selectionAdminApi,
    reports: reportApi
  };
};
