import { QueryClient } from "@tanstack/react-query";

/**
 * Factory for a dedicated QueryClient instance (browser or per-request on the server).
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
      },
    },
  });
