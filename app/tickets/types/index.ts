export interface Ticket {
  id: string;
  title: string;
  date: string;
  requester: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  visibility?: 'Public' | 'Private';
  notes?: string;
  resolvedDate?: string;
  attachments?: string[];
  adminResponse?: string;
  likes?: number;
}

export interface TicketTableProps {
  tickets: Ticket[];
} 