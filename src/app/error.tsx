"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Recoverable segment error boundary. Wraps `{children}` of the same segment.
 */
export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast.error("Something went wrong", {
      description: error.digest ? `Digest: ${error.digest}` : undefined,
    });
  }, [error.digest]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div>
        <h1 className="text-lg font-semibold">This page failed to render</h1>
        <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          {error.message}
        </p>
      </div>
      <button
        className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950"
        onClick={() => {
          reset();
        }}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
