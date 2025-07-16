// Mess Admin Feature Types

export interface MessStats {
  totalVendors: number;
  totalActivePlans: number;
  totalStudentsEnrolled: number;
  monthlyRevenue: number;
  averageRating: number;
}

export interface VendorWithStats {
  vendorId: number;
  vendorName: string;
  totalPlans: number;
  totalStudents: number;
  monthlyRevenue: number;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: string;
}

export interface PlanWithDetails {
  vendorPlanId: number;
  planName: string;
  vendorName: string;
  fee: number;
  mealTypes: string[];
  enrolledStudents: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  lastUpdated: string;
}

export interface StudentSelection {
  studentId: number;
  studentName: string;
  studentEmail: string;
  vendorName: string;
  planName: string;
  selectedMonth: string;
  fee: number;
  mealTypes: string[];
  enrollmentDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

// Form Types
export interface CreateVendorForm {
  vendorName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  description?: string;
}

export interface CreatePlanForm {
  planName: string;
  vendorId: number;
  fee: number;
  mealTypes: string[];
  description?: string;
  maxCapacity?: number;
  startDate: string;
  endDate: string;
}

export interface VendorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVendorForm) => void;
  vendor?: VendorWithStats;
  isEditing?: boolean;
}

export interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanForm) => void;
  vendors: VendorWithStats[];
  plan?: PlanWithDetails;
  isEditing?: boolean;
}

// Table Props
export interface VendorsTableProps {
  vendors: VendorWithStats[];
  onEdit: (vendor: VendorWithStats) => void;
  onDelete: (vendorId: number) => void;
  onToggleStatus: (vendorId: number, status: 'active' | 'inactive') => void;
}

export interface PlansTableProps {
  plans: PlanWithDetails[];
  onEdit: (plan: PlanWithDetails) => void;
  onDelete: (planId: number) => void;
  onToggleStatus: (planId: number, status: 'active' | 'inactive') => void;
}

export interface StudentsTableProps {
  students: StudentSelection[];
  onViewDetails: (studentId: number) => void;
  onCancelSelection: (selectionId: number) => void;
}

// Filter Types
export interface MessFilters {
  vendorFilter: string;
  statusFilter: 'all' | 'active' | 'inactive' | 'pending';
  mealTypeFilter: string;
  dateRange: {
    start: string;
    end: string;
  };
}

// Analytics Types
export interface MessAnalytics {
  dailyEnrollments: Array<{
    date: string;
    count: number;
  }>;
  planPopularity: Array<{
    planName: string;
    enrollments: number;
  }>;
  revenueByVendor: Array<{
    vendorName: string;
    revenue: number;
  }>;
  mealTypeDistribution: Array<{
    mealType: string;
    percentage: number;
  }>;
}

// Export all mess types for easier importing
export * from '../../mess/types';
