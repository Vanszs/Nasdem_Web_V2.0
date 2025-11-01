"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const lastFetchedAt = useAuthStore((s) => s.lastFetchedAt);

  useEffect(() => {
    // If we've finished checking auth and there's no user, redirect to login
    if (!isLoading && !user && lastFetchedAt && lastFetchedAt > 0) {
      console.log("🚪 [AuthGuard] No authenticated user, redirecting to login...");
      router.replace("/auth");
      return;
    }

    // If there's an auth error (like 401), redirect to login
    if (error && error.includes("401")) {
      console.log("🚪 [AuthGuard] Auth error detected, redirecting to login...");
      router.replace("/auth");
      return;
    }
  }, [user, isLoading, error, lastFetchedAt, router]);

  // Show loading state while checking auth
  if (isLoading && !user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001B55]"></div>
      </div>
    );
  }

  // If not authenticated and we've checked, don't render children
  if (!user && lastFetchedAt && lastFetchedAt > 0) {
    return fallback || null;
  }

  return <>{children}</>;
}