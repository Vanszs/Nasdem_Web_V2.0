"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { UserRole } from "@/lib/rbac";

interface AuthContextType {
  user: ReturnType<typeof useAuthStore>["user"];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthProvider({ children, fallback }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const lastFetchedAt = useAuthStore((s) => s.lastFetchedAt);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const logout = useAuthStore((s) => s.logout);

  const isAuthenticated = !!user;
  const hasRole = (role: UserRole) => user?.role === role;

  // Initialize auth state on mount
  useEffect(() => {
    console.log("🔐 [AuthProvider] Initializing authentication...");
    
    const initAuth = async () => {
      try {
        // Only fetch if we haven't fetched recently (within last 5 minutes)
        const now = Date.now();
        const shouldFetch = !lastFetchedAt || (now - lastFetchedAt > 5 * 60 * 1000);
        
        if (shouldFetch) {
          console.log("🔄 [AuthProvider] Fetching fresh auth data...");
          await fetchUser();
        }
      } catch (err) {
        console.error("❌ [AuthProvider] Failed to initialize auth:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [fetchUser, lastFetchedAt]);

  // Handle auth errors and redirect
  useEffect(() => {
    if (!isInitialized || isRedirecting) return;

    // If we have an auth error (401) and we're not already redirecting
    if (error && error.includes("401") && !isRedirecting) {
      console.log("🚪 [AuthProvider] Auth error detected, redirecting to login...");
      setIsRedirecting(true);
      router.replace("/auth");
      return;
    }

    // If we're not authenticated and trying to access admin routes
    if (!isAuthenticated && pathname.startsWith("/admin") && pathname !== "/auth") {
      console.log("🚪 [AuthProvider] No auth, redirecting to login...");
      setIsRedirecting(true);
      router.replace("/auth");
      return;
    }
  }, [isAuthenticated, error, pathname, isInitialized, isRedirecting, router]);

  // Auto-refresh token before expiry (every 20 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        console.log("🔄 [AuthProvider] Auto-refreshing token...");
        await fetchUser({ force: true });
      } catch (err) {
        console.error("❌ [AuthProvider] Failed to refresh token:", err);
      }
    }, 20 * 60 * 1000); // 20 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUser]);

  // Manual refresh function
  const refreshAuth = async () => {
    try {
      console.log("🔄 [AuthProvider] Manual token refresh...");
      await fetchUser({ force: true });
    } catch (err) {
      console.error("❌ [AuthProvider] Failed to refresh token:", err);
      throw err;
    }
  };

  // Enhanced logout function
  const handleLogout = async () => {
    try {
      console.log("🚪 [AuthProvider] Logging out...");
      await logout();
      router.replace("/auth");
    } catch (err) {
      console.error("❌ [AuthProvider] Failed to logout:", err);
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#001B55] mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Show fallback if provided and we're redirecting
  if (fallback && isRedirecting) {
    return <>{fallback}</>;
  }

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated,
    hasRole,
    refreshAuth,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}