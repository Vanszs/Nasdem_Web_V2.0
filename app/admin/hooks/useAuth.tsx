"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  useEffect(() => {
    // Fetch once and rely on 10-minute cache TTL in the store
    fetchUser().catch(() => {});
  }, [fetchUser]);
  return <>{children}</>;
}

export function useAuth() {
  const { user, isLoading, login, logout, fetchUser } = useAuthStore();
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetch: () => fetchUser({ force: true }),
  };
}
