import { create } from 'zustand';
import { config } from '@/lib/config';
import { useAuth } from './use-auth';

interface UserData {
  id: string;
  username: string;
  email: string;
  userRoles: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserStore {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  clearUserData: () => void;
}

export const useUser = create<UserStore>((set) => ({
  userData: null,
  isLoading: false,
  error: null,

  fetchUserData: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${config.api.backendUrl}/user/whoAmI`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      set({ userData: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },

  clearUserData: () => {
    set({ userData: null, error: null });
  }
})); 