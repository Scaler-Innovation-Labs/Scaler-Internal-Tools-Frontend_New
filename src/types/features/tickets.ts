// Ticket Status enum matching backend
export type TicketStatus = 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED' 
  | 'REOPENED' 
  | 'ON_HOLD' 
  | 'CANCELED' 
  | 'PENDING';

// Ticket Priority enum matching backend
export type TicketPriority = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'CRITICAL' 
  | 'BLOCKER';

// Campus Type enum matching backend
export type CampusType = 
  | 'MICRO_CAMPUS' 
  | 'MACRO_CAMPUS';

// Main Ticket interface matching TicketResponseDto
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  ticketStatus: TicketStatus; // Changed from status to match backend
  campus: string;
  upvote: number;
  imageUrl: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  private: boolean; // Changed from isPrivate to match backend
}

// Ticket Summary interface matching TicketSummaryDto
export interface TicketSummary {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  ticketStatus: TicketStatus; // Changed from status to match backend
  campus: string;
  upvote: number;
  private: boolean; // Changed from isPrivate to match backend
  createdAt?: string;
  updatedAt?: string;
  resolvedDate?: string; // Date when ticket was resolved
  imageUrl?: string[];
  adminResponses?: string[]; // Admin responses/comments
  adminResponse?: string; // Single admin response (legacy)
}

// Ticket Create interface matching TicketCreateDto
export interface TicketCreateData {
  title: string;
  description: string;
  priority: TicketPriority;
  status?: TicketStatus; // Optional, defaults to PENDING
  campus: CampusType;
  private?: boolean; // Changed from isPrivate to match backend
  imageUrl?: string[]; // Optional
}

// Ticket Update interface matching TicketUpdateDto
export interface TicketUpdateData {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  campus?: CampusType;
  imageUrl?: string[];
  private?: boolean; // Changed from isPrivate to match backend
  resolvedDate?: string; // Date when ticket was resolved
}

export interface TicketTableProps {
  tickets: Ticket[];
  onLike?: (id: number) => void;
  onDelete?: (id: number) => void;
  refreshTickets?: () => Promise<void>;
}

export interface TicketOverviewProps {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  refreshTickets: () => Promise<void>;
}

export interface IssueDetailModalProps {
  issue: Ticket;
  onClose: () => void;
  isAuthorizedUser?: boolean;
}

export interface TicketStats {
  total: number;
  open: number;
  resolved: number;
  resolutionRate: number;
}

export interface TicketFilters {
  status: TicketStatus | '';
  priority: TicketPriority | '';
  campus: CampusType | '';
  sortBy: string;
}

// Legacy interfaces for backward compatibility
export interface TicketCreateDataLegacy {
  title: string;
  description: string;
  priority: string;
  status: string;
  campus: string;
  imageUrl: string[];
  upvote: number;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface TicketUpdateDataLegacy {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  assignee?: string;
  visibility?: string;
  attachments?: string[];
} 
  assignee?: string;
  visibility?: string;
  attachments?: string[];
} 