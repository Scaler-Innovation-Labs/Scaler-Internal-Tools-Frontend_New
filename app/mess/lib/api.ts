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
  VendorPlanSelectionSummaryDto
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Create API factory that takes fetchWithAuth function
export const createMessApi = (fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>) => {
  
  // Vendor API
  const vendorApi = {
    // Admin endpoints
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

  // Vendor Plan API
  const vendorPlanApi = {
    // Admin endpoints
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
    create: async (selection: VendorPlanSelectionCreateDto): Promise<VendorPlanSelectionResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selection)
      });
      if (!response.ok) throw new Error('Failed to create vendor plan selection');
      return response.json();
    },

    update: async (id: number, selection: VendorPlanSelectionUpdateDto): Promise<VendorPlanSelectionResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selection)
      });
      if (!response.ok) throw new Error('Failed to update vendor plan selection');
      return response.json();
    },

    delete: async (id: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/admin/vendorPlanSelection/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor plan selection');
      return response.text();
    }
  };

  // Vendor Plan Selection API (User)
  const userVendorPlanSelectionApi = {
    fetch: async (id: number): Promise<VendorPlanSelectionSummaryDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/fetch/${id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor plan selection');
      return response.json();
    },

    fetchByUser: async (userId: number): Promise<VendorPlanSelectionSummaryDto[]> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/fetchByUser/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user vendor plan selections');
      return response.json();
    },

    create: async (selection: VendorPlanSelectionCreateDto): Promise<VendorPlanSelectionResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selection)
      });
      if (!response.ok) throw new Error('Failed to create vendor plan selection');
      return response.json();
    },

    update: async (id: number, selection: VendorPlanSelectionUpdateDto): Promise<VendorPlanSelectionResponseDto> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selection)
      });
      if (!response.ok) throw new Error('Failed to update vendor plan selection');
      return response.json();
    },

    delete: async (id: number): Promise<string> => {
      const response = await fetchWithAuth(`${API_BASE}/mess/vendorPlanSelection/delete/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vendor plan selection');
      return response.text();
    }
  };

  return {
    vendorApi,
    vendorPlanApi,
    adminVendorPlanSelectionApi,
    userVendorPlanSelectionApi
  };
};

