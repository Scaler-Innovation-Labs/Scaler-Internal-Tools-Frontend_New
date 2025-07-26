import type { ChatBotDocResponseDto, ChatBotDocCreateDto, ChatResponse } from '@/types/features/chat';

export class PolicyDocsService {
  // Get all policy documents
  static async getAllDocs(fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>, backendUrl: string): Promise<ChatBotDocResponseDto[]> {
    try {
      const response = await fetchWithAuth(`${backendUrl}/policyChatBot/admin/getAllDocs`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching policy documents:', error);
      throw error;
    }
  }

  // Upload a new policy document
  static async uploadDocument(
    data: ChatBotDocCreateDto, 
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>, 
    backendUrl: string
  ): Promise<string> {
    try {
      // Validate inputs
      console.log('Upload data:', {
        documentName: data.documentName,
        fileInfo: {
          name: data.file.name,
          size: data.file.size,
          type: data.file.type,
          lastModified: data.file.lastModified
        }
      });

      // Ensure file is a PDF
      if (!data.file.type.includes('pdf') && !data.file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Please select a PDF file only.');
      }

      // Ensure file size is reasonable (< 10MB)
      if (data.file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB.');
      }

      // Create FormData exactly like curl -F commands
      // curl -F "documentName=HR Policy 2024" -F "file=@/path/to/file.pdf"
      const formData = new FormData();
      formData.append('documentName', data.documentName.trim());
      formData.append('file', data.file);

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value);
      }

      const uploadUrl = `${backendUrl}/policyChatBot/admin/upload`;
      console.log('Upload URL:', uploadUrl);

      // First try with fetchWithAuth (includes JWT token)
      console.log('Attempting upload with authenticated request...');
      try {
        const response = await fetchWithAuth(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        console.log('Auth request - Status:', response.status);
        console.log('Auth request - Headers received:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const result = await response.text();
          console.log('Auth upload successful:', result);
          return result;
        } else {
          const errorText = await response.text();
          console.error('Auth request failed:', errorText);
        }
      } catch (authError) {
        console.error('Auth request exception:', authError);
      }

      // If auth request failed, try direct request (like Postman might be doing)
      console.log('Attempting direct upload (like Postman)...');
      try {
        const directResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include', // Include cookies
        });

        console.log('Direct request - Status:', directResponse.status);
        console.log('Direct request - Headers received:', Object.fromEntries(directResponse.headers.entries()));

        if (directResponse.ok) {
          const result = await directResponse.text();
          console.log('Direct upload successful:', result);
          return result;
        } else {
          const errorText = await directResponse.text();
          console.error('Direct request failed:', errorText);
        }
      } catch (directError) {
        console.error('Direct request exception:', directError);
      }

      // If both fail, try with basic auth headers (if Postman uses Basic Auth)
      console.log('Attempting upload with explicit auth headers...');
      try {
        // Get current cookies to see what auth we have
        console.log('Current cookies:', document.cookie);
        
        const explicitAuthResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            // Don't set Content-Type - let browser handle FormData boundary
            'Accept': 'application/json, text/plain, */*',
          }
        });

        console.log('Explicit auth - Status:', explicitAuthResponse.status);
        console.log('Explicit auth - Headers received:', Object.fromEntries(explicitAuthResponse.headers.entries()));

        if (!explicitAuthResponse.ok) {
          const errorText = await explicitAuthResponse.text();
          console.error('Explicit auth failed:', errorText);
          
          // Parse the error to give better feedback
          let errorMessage = `HTTP ${explicitAuthResponse.status}: ${explicitAuthResponse.statusText}`;
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
          throw new Error(errorMessage);
        }

        const result = await explicitAuthResponse.text();
        console.log('Explicit auth upload successful:', result);
        return result;

      } catch (error) {
        console.error('All upload attempts failed:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Delete a policy document
  static async deleteDocument(
    id: number, 
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>, 
    backendUrl: string
  ): Promise<string> {
    try {
      const response = await fetchWithAuth(`${backendUrl}/policyChatBot/admin/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        // Get more detailed error information
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch (e) {
          // Ignore error text parsing errors
        }
        throw new Error(errorMessage);
      }

      return await response.text();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Chat with the policy bot
    static async sendMessage(
    message: string,
    conversationId: string,
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
    backendUrl: string
  ): Promise<ChatResponse> {
    try {
      // Backend expects URL-encoded form data for the chat endpoint
      const params = new URLSearchParams();
      params.append('message', message);
      params.append('conversationId', conversationId);

      const response = await fetchWithAuth(`${backendUrl}/policyChatBot/getAns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        // Get more detailed error information
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch (e) {
          // Ignore error text parsing errors
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
} 