"use client";

/**
 * Fallback for errors thrown from the root layout. Must define its own `html` and `body`.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-zinc-900">
        <div>
          <h1 className="text-lg font-semibold">Application error</h1>
          <p className="mt-2 max-w-md text-sm text-zinc-600">{error.message}</p>
        </div>
        <button
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          onClick={() => {
            reset();
          }}
          type="button"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
