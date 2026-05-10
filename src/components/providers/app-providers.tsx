"use client";

import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { queryKeys } from "@/hooks/query-keys";
import { createQueryClient } from "@/lib/query-client";

/**
 * Registers shared query keys inside the client boundary so tree-shaking keeps key helpers in use.
 */
const QueryKeyRegistry = (): null => {
  useQuery({
    queryKey: queryKeys.health(),
    queryFn: async () => ({ ok: true as const }),
    enabled: false,
  });
  return null;
};

/**
 * Root client providers: TanStack Query, Auth.js session context, Sonner toasts.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient);

  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <QueryClientProvider client={queryClient}>
        <QueryKeyRegistry />
        {children}
        {process.env.NODE_ENV === "development" ? (
          <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
        ) : null}
        <Toaster expand position="top-right" richColors closeButton duration={4500} />
      </QueryClientProvider>
    </SessionProvider>
  );
};
