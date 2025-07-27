import { useState, useCallback, useRef } from 'react';
import { useTicketsApi } from '@/services/api/tickets';
import type { Ticket, TicketCreateData, TicketUpdateData, TicketStats } from '@/types/features/tickets';

interface UseTicketsProps {
  isAdmin?: boolean;
}

export function useTickets({ isAdmin = false }: UseTicketsProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({ total: 0, open: 0, resolved: 0, resolutionRate: 0 });
  
  const ticketsApi = useTicketsApi();
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 1000; // 1 second

  // Calculate stats from tickets
  const calculateStats = useCallback((ticketList: Ticket[]) => {
    const total = ticketList.length;
    const open = ticketList.filter(t => t.status === 'open' || t.status === 'Open').length;
    const resolved = ticketList.filter(t => t.status === 'resolved' || t.status === 'Resolved').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, open, resolved, resolutionRate };
  }, []);

  const fetchTickets = useCallback(async () => {
    const now = Date.now();
    
    if (fetchInProgressRef.current || (now - lastFetchTimeRef.current) < MIN_FETCH_INTERVAL) {
      return;
    }
    
    try {
      fetchInProgressRef.current = true;
      lastFetchTimeRef.current = now;
      setLoading(true);
      setError(null);
      
      const result = await ticketsApi.getTickets();
      setTickets(result);
      setStats(calculateStats(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTickets([]);
      setStats({ total: 0, open: 0, resolved: 0, resolutionRate: 0 });
    } finally {
      setLoading(false);
      setTimeout(() => {
        fetchInProgressRef.current = false;
      }, 50);
    }
  }, [ticketsApi, calculateStats]);

  const createTicket = useCallback(async (ticketData: TicketCreateData) => {
    if (fetchInProgressRef.current) return null;
    
    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      const result = await ticketsApi.createTicket(ticketData);
      
      // Refresh tickets to get updated list
      await fetchTickets();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => {
        fetchInProgressRef.current = false;
      }, 100);
    }
  }, [ticketsApi, fetchTickets]);

  const updateTicket = useCallback(async (id: string, ticketData: TicketUpdateData) => {
    if (fetchInProgressRef.current) return null;
    
    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      const result = await ticketsApi.updateTicket(id, ticketData);
      
      // Refresh tickets to get updated list
      await fetchTickets();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [ticketsApi, fetchTickets]);

  const deleteTicket = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await ticketsApi.deleteTicket(id);
      
      // Remove the deleted ticket from state
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      setStats(prev => calculateStats(tickets.filter(ticket => ticket.id !== id)));
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [ticketsApi, tickets, calculateStats]);

  const likeTicket = useCallback(async (id: string) => {
    try {
      const result = await ticketsApi.likeTicket(id);
      
      // Update the ticket's likes count in state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, likes: result.likes } : ticket
      ));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [ticketsApi]);

  const updateTicketStatus = useCallback(async (id: string, status: string) => {
    try {
      await ticketsApi.updateTicketStatus(id, status);
      
      // Update the ticket's status in state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, status: status as any } : ticket
      ));
      
      // Recalculate stats
      setStats(prev => calculateStats(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, status: status as any } : ticket
      )));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [ticketsApi, tickets, calculateStats]);

  const uploadTicketImages = useCallback(async (id: string, files: File[]) => {
    try {
      const result = await ticketsApi.uploadTicketImages(id, files);
      
      // Update the ticket's attachments in state
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, attachments: [...(ticket.attachments || []), ...result] } : ticket
      ));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [ticketsApi]);

  const addComment = useCallback(async (id: string, text: string) => {
    try {
      const result = await ticketsApi.addComment(id, text);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [ticketsApi]);

  const getComments = useCallback(async (id: string) => {
    try {
      const result = await ticketsApi.getComments(id);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    }
  }, [ticketsApi]);

  // Refresh tickets function
  const refreshTickets = useCallback(async () => {
    await fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    stats,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    likeTicket,
    updateTicketStatus,
    uploadTicketImages,
    addComment,
    getComments,
    refreshTickets,
  };
} 