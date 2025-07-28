import { useAuth } from "@/hooks/auth/use-auth";
import { config } from "@/lib/configs";
import type { Ticket, TicketCreateData, TicketUpdateData } from "@/types/features/tickets";

export function useTicketsApi() {
  const { fetchWithAuth } = useAuth();
  const backendUrl = config.api.backendUrl;

  const getTickets = async (): Promise<Ticket[]> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets`);
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    return response.json();
  };

  const getTicketById = async (id: string): Promise<Ticket> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }
    return response.json();
  };

  const createTicket = async (ticketData: TicketCreateData): Promise<Ticket> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }
    return response.json();
  };

  const updateTicket = async (id: string, ticketData: TicketUpdateData): Promise<Ticket> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) {
      throw new Error('Failed to update ticket');
    }
    return response.json();
  };

  const deleteTicket = async (id: string): Promise<void> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete ticket');
    }
  };

  const likeTicket = async (id: string): Promise<{ likes: number }> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/${id}/like`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to like ticket');
    }
    return response.json();
  };

  const updateTicketStatus = async (id: string, status: string): Promise<void> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to update ticket status');
    }
  };

  const resolveTicket = async (id: string, resolvedDate: string): Promise<Ticket> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/${id}/resolve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ticketStatus: 'RESOLVED',
        resolvedDate: resolvedDate 
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to resolve ticket');
    }
    return response.json();
  };

  const uploadTicketImages = async (id: string, files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await fetchWithAuth(`${backendUrl}/api/issues/tickets/${id}/images`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload images');
    }
    return response.json();
  };

  const addComment = async (id: string, text: string): Promise<any> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    return response.json();
  };

  const getComments = async (id: string): Promise<any[]> => {
    const response = await fetchWithAuth(`${backendUrl}/api/issues/${id}/comments`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  };

  return {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    likeTicket,
    updateTicketStatus,
    resolveTicket,
    uploadTicketImages,
    addComment,
    getComments,
  };
} 