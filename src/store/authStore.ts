import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'GUEST' | 'BUYER' | 'SELLER' | 'ADMIN' | 'SUPERADMIN';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateRole: (role) => set((state) => ({ 
        user: state.user ? { ...state.user, role } : null 
      })),
    }),
    { name: 'auth-storage' }
  )
);
