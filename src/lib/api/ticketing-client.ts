import { config } from '@/lib/configs';
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

export interface TicketingApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TicketingApiError {
  message: string;
  status: number;
  details?: any;
}

class TicketingApiClient {
  private baseUrl: string;
  private fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;

  constructor(fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>) {
    this.baseUrl = `${config.api.backendUrl}/api/issues`;
    this.fetchWithAuth = fetchWithAuth;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let errorDetails = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
        console.error('Backend error details:', errorData);
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
        console.error('Backend error status:', response.status, response.statusText);
      }

      const error: TicketingApiError = {
        message: errorMessage,
        status: response.status,
        details: errorDetails,
      };

      throw error;
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as T;
    }

    return response.json();
  }

  // Get all tickets
  async getTickets(): Promise<TicketSummary[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets`);
    return this.handleResponse<TicketSummary[]>(response);
  }

  // Get ticket by ID
  async getTicketById(id: number): Promise<Ticket> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}`);
    return this.handleResponse<Ticket>(response);
  }

  // Create new ticket
  async createTicket(ticketData: TicketCreateData): Promise<Ticket> {
    console.log('Creating ticket with data:', ticketData);
    
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    
    const result = await this.handleResponse<Ticket>(response);
    console.log('Ticket created successfully:', result);
    return result;
  }

  // Update ticket
  async updateTicket(id: number, ticketData: TicketUpdateData): Promise<Ticket> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    return this.handleResponse<Ticket>(response);
  }

  // Delete ticket
  async deleteTicket(id: number): Promise<void> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse<void>(response);
  }

  // Upvote ticket
  async upvoteTicket(id: number): Promise<Ticket> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}/upvote`, {
      method: 'POST',
    });
    return this.handleResponse<Ticket>(response);
  }

  // Update ticket status
  async updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/tickets/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: 'PATCH',
      }
    );
    return this.handleResponse<Ticket>(response);
  }

  // Upload ticket images
  async uploadTicketImages(id: number, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}/images`, {
      method: 'POST',
      body: formData,
    });
    return this.handleResponse<string[]>(response);
  }

  // Get tickets by user ID
  async getTicketsByUser(userId: string): Promise<TicketSummary[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/user/${userId}`);
    return this.handleResponse<TicketSummary[]>(response);
  }

  // Get tickets by status
  async getTicketsByStatus(status: TicketStatus): Promise<TicketSummary[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/status/${status}`);
    return this.handleResponse<TicketSummary[]>(response);
  }

  // Get tickets by priority
  async getTicketsByPriority(priority: TicketPriority): Promise<TicketSummary[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/priority/${priority}`);
    return this.handleResponse<TicketSummary[]>(response);
  }

  // Get tickets by campus
  async getTicketsByCampus(campus: CampusType): Promise<TicketSummary[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/campus/${campus}`);
    return this.handleResponse<TicketSummary[]>(response);
  }

  // Legacy methods for backward compatibility
  async likeTicket(id: number): Promise<{ upvote: number }> {
    const result = await this.upvoteTicket(id);
    return { upvote: result.upvote };
  }

  // Add comment to ticket (if implemented in backend)
  async addComment(id: number, text: string): Promise<any> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    return this.handleResponse<any>(response);
  }

  // Get comments for ticket (if implemented in backend)
  async getComments(id: number): Promise<any[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}/comments`);
    return this.handleResponse<any[]>(response);
  }

  // Get ticket statistics (if implemented in backend)
  async getTicketStats(): Promise<TicketStats> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/stats`);
    return this.handleResponse<TicketStats>(response);
  }

  // Search tickets (if implemented in backend)
  async searchTickets(query: string, filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    campus?: CampusType;
  }): Promise<TicketSummary[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.campus) params.append('campus', filters.campus);

    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/search?${params.toString()}`);
    return this.handleResponse<TicketSummary[]>(response);
  }

  // Assign ticket to user (if implemented in backend)
  async assignTicket(id: number, assigneeId: string): Promise<Ticket> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/tickets/${id}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assigneeId }),
    });
    return this.handleResponse<Ticket>(response);
  }
}

export default TicketingApiClient; 