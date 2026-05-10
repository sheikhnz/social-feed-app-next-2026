/**
 * Route-level loading UI shown while navigating between segments that suspend.
 */
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading page"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4"
    >
      <div className="size-9 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800 dark:border-zinc-700 dark:border-t-white" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
    </div>
  );
}
