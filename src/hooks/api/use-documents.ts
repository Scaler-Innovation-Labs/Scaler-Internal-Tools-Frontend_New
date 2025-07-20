import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/use-auth';
import { config } from '@/lib/configs';

// Backend DTO types (partial)
export interface DocumentCategory {
  id: number;
  name: string;
  normalizedName?: string;
}

export interface Tag {
  id: number;
  name: string;
}

// Admin response contains more fields
export interface DocumentResponse {
  id: number;
  title: string;
  category: DocumentCategory;
  allowedUsers: string[];
  tags: Tag[];
  latestFilePath: string;
  versionNumber: number;
  uploadedAt: string;
  uploadedBy: string;
  updatedAt: string;
}

// User summary response
export interface DocumentSummary {
  title: string;
  category: DocumentCategory;
  tags: Tag[];
  latestFilePath: string;
  uploadedAt: string;
  updatedAt: string;
}

interface UseDocumentsOptions {
  isAdmin?: boolean;
}

export function useDocuments({ isAdmin = false }: UseDocumentsOptions = {}) {
  const [documents, setDocuments] = useState<Array<DocumentResponse | DocumentSummary>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();

  const backendBase = config.api.backendUrl;

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isAdmin
        ? `${backendBase}/document/admin/getAll`
        : `${backendBase}/document/user/getAll`;

      const response = await fetchWithAuth(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents – ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
  };
} 