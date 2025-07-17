import { useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import { config } from '@/lib/config';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  createdBy: string;
}

interface UseTicketsProps {
  isAdmin?: boolean;
}

export function useTickets({ isAdmin = false }: UseTicketsProps = {}) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = isAdmin ? '/api/admin/tickets' : '/api/tickets';
      const response = await fetchWithAuth(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, fetchWithAuth]);

  const createTicket = useCallback(async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      setError(null);
      const response = await fetchWithAuth('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      await fetchTickets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchWithAuth, fetchTickets]);

  const updateTicket = useCallback(async (id: string, ticketData: Partial<Ticket>) => {
    try {
      setError(null);
      const response = await fetchWithAuth(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      await fetchTickets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchWithAuth, fetchTickets]);

  const deleteTicket = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await fetchWithAuth(`/api/tickets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [fetchWithAuth]);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
  };
} 