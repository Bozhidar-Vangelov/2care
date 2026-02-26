"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Creates a stable QueryClient per React tree, required for Next.js App Router.
 * useState with a lazy initializer creates the client exactly once per mount
 * without triggering the react-hooks/refs lint error from the React compiler.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is immediately stale — refetch on mount by default.
        // Individual queries can override (e.g. useCurrentUser uses Infinity).
        staleTime: 0,
        // Keep unused/inactive query data in cache for 5 minutes
        gcTime: 1000 * 60 * 5,
        // Retry once before surfacing an error
        retry: 1,
        // Don't refetch just because the user switched tabs
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Never auto-retry mutations — let the user decide to resubmit
        retry: 0,
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer — makeQueryClient() runs only on first mount, never on re-renders
  const [queryClient] = useState(() => makeQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
