import { create } from 'zustand';

interface AuthUser {
  id: string;
  [key: string]: unknown;
}

interface UIState {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser | null) => void;
  clearAuth: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  user: null,
  isAuthenticated: false,
  setAuth: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
