import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/auth/use-auth';
import TicketingApiClient from '@/lib/api/ticketing-client';
import type { 
  Ticket, 
  TicketSummary,
  TicketCreateData, 
  TicketUpdateData, 
  TicketStats,
  TicketStatus,
  TicketPriority,
  CampusType
} from '@/types/features/tickets';

interface UseTicketingClientOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseTicketingClientReturn {
  // State
  tickets: TicketSummary[];
  stats: TicketStats;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTickets: () => Promise<void>;
  createTicket: (data: TicketCreateData) => Promise<Ticket | null>;
  updateTicket: (id: number, data: TicketUpdateData) => Promise<Ticket | null>;
  deleteTicket: (id: number) => Promise<boolean>;
  upvoteTicket: (id: number) => Promise<boolean>;
  updateTicketStatus: (id: number, status: TicketStatus) => Promise<boolean>;
  uploadImages: (id: number, files: File[]) => Promise<string[] | null>;
  getTicketById: (id: number) => Promise<Ticket | null>;
  getTicketsByUser: (userId: string) => Promise<TicketSummary[]>;
  getTicketsByStatus: (status: TicketStatus) => Promise<TicketSummary[]>;
  getTicketsByPriority: (priority: TicketPriority) => Promise<TicketSummary[]>;
  getTicketsByCampus: (campus: CampusType) => Promise<TicketSummary[]>;
  
  // Legacy methods for backward compatibility
  likeTicket: (id: number) => Promise<boolean>;
  addComment: (id: number, text: string) => Promise<any>;
  getComments: (id: number) => Promise<any[]>;
  searchTickets: (query: string, filters?: any) => Promise<TicketSummary[]>;
  assignTicket: (id: number, assigneeId: string) => Promise<Ticket | null>;
  
  // Utilities
  clearError: () => void;
  refreshStats: () => Promise<void>;
}

export function useTicketingClient(options: UseTicketingClientOptions = {}): UseTicketingClientReturn {
  const { fetchWithAuth } = useAuth();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [stats, setStats] = useState<TicketStats>({ 
    total: 0, 
    open: 0, 
    resolved: 0, 
    resolutionRate: 0 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clientRef = useRef<TicketingApiClient | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  // Initialize client
  if (!clientRef.current) {
    clientRef.current = new TicketingApiClient(fetchWithAuth);
  }

  // Calculate stats from tickets
  const calculateStats = useCallback((ticketList: TicketSummary[]): TicketStats => {
    const total = ticketList.length;
    const open = ticketList.filter(t => 
      t.ticketStatus === 'OPEN' || t.ticketStatus === 'IN_PROGRESS' || t.ticketStatus === 'PENDING'
    ).length;
    const resolved = ticketList.filter(t => 
      t.ticketStatus === 'RESOLVED' || t.ticketStatus === 'CLOSED'
    ).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    return { total, open, resolved, resolutionRate };
  }, []);

  // Fetch tickets with debouncing
  const fetchTickets = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      const result = await clientRef.current!.getTickets();
      setTickets(result);
      setStats(calculateStats(result));
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [calculateStats]);

  // Get ticket by ID
  const getTicketById = useCallback(async (id: number): Promise<Ticket | null> => {
    try {
      setError(null);
      const result = await clientRef.current!.getTicketById(id);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch ticket';
      setError(errorMessage);
      console.error('Error fetching ticket:', err);
      return null;
    }
  }, []);

  // Create ticket
  const createTicket = useCallback(async (data: TicketCreateData): Promise<Ticket | null> => {
    try {
      setError(null);
      const result = await clientRef.current!.createTicket(data);
      
      // Refresh tickets to get updated list
      await fetchTickets();
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create ticket';
      setError(errorMessage);
      console.error('Error creating ticket:', err);
      return null;
    }
  }, [fetchTickets]);

  // Update ticket
  const updateTicket = useCallback(async (id: number, data: TicketUpdateData): Promise<Ticket | null> => {
    try {
      setError(null);
      const result = await clientRef.current!.updateTicket(id, data);
      
      // Update ticket in local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { 
          ...ticket, 
          ...result,
          // Ensure resolvedDate is preserved if backend doesn't return it
          resolvedDate: result.resolvedDate !== undefined ? result.resolvedDate : data.resolvedDate
        } : ticket
      ));
      
      // Recalculate stats
      setStats(prev => calculateStats(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, ...result } : ticket
      )));
      
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update ticket';
      setError(errorMessage);
      console.error('Error updating ticket:', err);
      return null;
    }
  }, [tickets, calculateStats]);

  // Delete ticket
  const deleteTicket = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await clientRef.current!.deleteTicket(id);
      
      // Remove ticket from local state
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      setStats(prev => calculateStats(tickets.filter(ticket => ticket.id !== id)));
      
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to delete ticket';
      setError(errorMessage);
      console.error('Error deleting ticket:', err);
      return false;
    }
  }, [tickets, calculateStats]);

  // Upvote ticket
  const upvoteTicket = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const result = await clientRef.current!.upvoteTicket(id);
      
      // Update ticket upvotes in local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, upvote: result.upvote } : ticket
      ));
      
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to upvote ticket';
      setError(errorMessage);
      console.error('Error upvoting ticket:', err);
      return false;
    }
  }, []);

  // Update ticket status
  const updateTicketStatus = useCallback(async (id: number, status: TicketStatus): Promise<boolean> => {
    try {
      setError(null);
      await clientRef.current!.updateTicketStatus(id, status);
      
      // Update ticket status in local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, ticketStatus: status } : ticket
      ));
      
      // Recalculate stats
      setStats(prev => calculateStats(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, ticketStatus: status } : ticket
      )));
      
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update ticket status';
      setError(errorMessage);
      console.error('Error updating ticket status:', err);
      return false;
    }
  }, [tickets, calculateStats]);

  // Upload images
  const uploadImages = useCallback(async (id: number, files: File[]): Promise<string[] | null> => {
    try {
      setError(null);
      const result = await clientRef.current!.uploadTicketImages(id, files);
      
      // Update ticket images in local state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { 
          ...ticket, 
          imageUrl: [...(ticket.imageUrl || []), ...result] 
        } : ticket
      ));
      
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to upload images';
      setError(errorMessage);
      console.error('Error uploading images:', err);
      return null;
    }
  }, []);

  // Get tickets by user
  const getTicketsByUser = useCallback(async (userId: string): Promise<TicketSummary[]> => {
    try {
      setError(null);
      const result = await clientRef.current!.getTicketsByUser(userId);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to get user tickets';
      setError(errorMessage);
      console.error('Error getting user tickets:', err);
      return [];
    }
  }, []);

  // Get tickets by status
  const getTicketsByStatus = useCallback(async (status: TicketStatus): Promise<TicketSummary[]> => {
    try {
      setError(null);
      const result = await clientRef.current!.getTicketsByStatus(status);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to get tickets by status';
      setError(errorMessage);
      console.error('Error getting tickets by status:', err);
      return [];
    }
  }, []);

  // Get tickets by priority
  const getTicketsByPriority = useCallback(async (priority: TicketPriority): Promise<TicketSummary[]> => {
    try {
      setError(null);
      const result = await clientRef.current!.getTicketsByPriority(priority);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to get tickets by priority';
      setError(errorMessage);
      console.error('Error getting tickets by priority:', err);
      return [];
    }
  }, []);

  // Get tickets by campus
  const getTicketsByCampus = useCallback(async (campus: CampusType): Promise<TicketSummary[]> => {
    try {
      setError(null);
      const result = await clientRef.current!.getTicketsByCampus(campus);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to get tickets by campus';
      setError(errorMessage);
      console.error('Error getting tickets by campus:', err);
      return [];
    }
  }, []);

  // Legacy methods for backward compatibility
  const likeTicket = useCallback(async (id: number): Promise<boolean> => {
    return upvoteTicket(id);
  }, [upvoteTicket]);

  // Add comment
  const addComment = useCallback(async (id: number, text: string): Promise<any> => {
    try {
      setError(null);
      const result = await clientRef.current!.addComment(id, text);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to add comment';
      setError(errorMessage);
      console.error('Error adding comment:', err);
      throw err;
    }
  }, []);

  // Get comments
  const getComments = useCallback(async (id: number): Promise<any[]> => {
    try {
      setError(null);
      const result = await clientRef.current!.getComments(id);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to get comments';
      setError(errorMessage);
      console.error('Error getting comments:', err);
      return [];
    }
  }, []);

  // Search tickets
  const searchTickets = useCallback(async (query: string, filters?: any): Promise<TicketSummary[]> => {
    try {
      setError(null);
      const result = await clientRef.current!.searchTickets(query, filters);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to search tickets';
      setError(errorMessage);
      console.error('Error searching tickets:', err);
      return [];
    }
  }, []);

  // Assign ticket
  const assignTicket = useCallback(async (id: number, assigneeId: string): Promise<Ticket | null> => {
    try {
      setError(null);
      const result = await clientRef.current!.assignTicket(id, assigneeId);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to assign ticket';
      setError(errorMessage);
      console.error('Error assigning ticket:', err);
      return null;
    }
  }, []);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    try {
      setError(null);
      const result = await clientRef.current!.getTicketStats();
      setStats(result);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to refresh stats';
      setError(errorMessage);
      console.error('Error refreshing stats:', err);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-refresh setup
  if (options.autoRefresh && options.refreshInterval && !refreshIntervalRef.current) {
    refreshIntervalRef.current = setInterval(() => {
      fetchTickets();
    }, options.refreshInterval);
  }

  return {
    // State
    tickets,
    stats,
    loading,
    error,
    
    // Actions
    fetchTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    upvoteTicket,
    updateTicketStatus,
    uploadImages,
    getTicketsByUser,
    getTicketsByStatus,
    getTicketsByPriority,
    getTicketsByCampus,
    
    // Legacy methods
    likeTicket,
    addComment,
    getComments,
    searchTickets,
    assignTicket,
    
    // Utilities
    clearError,
    refreshStats,
  };
} 