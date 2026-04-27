"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  AUTH_STORAGE_KEY,
  mockAuthenticatedUser,
  type AuthenticatedUser,
} from "../constants/auth";

interface AuthState {
  authenticatedUser: AuthenticatedUser | null;
  hasHydrated: boolean;
  login: (payload?: AuthenticatedUser) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authenticatedUser: null,
      hasHydrated: false,
      login: (payload = mockAuthenticatedUser) =>
        set({ authenticatedUser: payload }),
      logout: () => set({ authenticatedUser: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authenticatedUser: state.authenticatedUser,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
