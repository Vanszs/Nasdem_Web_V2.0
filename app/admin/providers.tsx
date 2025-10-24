"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { AuthProvider } from "./hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <ProgressProvider
      height="4px"
      color="#001b55"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ProgressProvider>
  );
}
