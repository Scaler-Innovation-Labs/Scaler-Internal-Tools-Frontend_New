import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/use-auth';
import { config } from '@/lib/configs';

export interface Category {
  id: string;
  name: string;
  documentCount: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();

  const backendBase = config.api.backendUrl;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithAuth(`${backendBase}/document/user/category/all`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories – ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
} 