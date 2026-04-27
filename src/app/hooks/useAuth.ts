"use client";

import { mockAuthenticatedUser } from "../constants/auth";
import { useAuthStore } from "../stores/useAuthStore";

export function useAuth() {
  const authenticatedUser = useAuthStore((state) => state.authenticatedUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    authenticatedUser,
    hasHydrated,
    isAuthenticated: Boolean(authenticatedUser),
    login: () => login(mockAuthenticatedUser),
    logout,
  };
}
