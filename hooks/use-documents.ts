import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Document {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  version: string;
}

interface UseDocumentsOptions {
  isAdmin?: boolean;
}

export function useDocuments({ isAdmin = false }: UseDocumentsOptions = {}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = isAdmin ? '/api/admin/documents' : '/api/documents';
      const response = await fetchWithAuth(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetchWithAuth('/api/admin/documents', {
        method: 'POST',
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      await fetchDocuments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const updateDocument = async (id: string, documentData: Partial<Document>) => {
    try {
      const response = await fetchWithAuth(`/api/admin/documents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      await fetchDocuments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      await fetchDocuments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [isAdmin]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  };
} 