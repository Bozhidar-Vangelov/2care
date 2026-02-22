import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown while an authenticated page segment is streaming.
 * Mirrors the `p-4 md:p-6 space-y-6` shell used by every page under
 * `(authenticated)` so there's no layout shift when content arrives.
 */
export default function AuthenticatedLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page title row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Primary card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Secondary card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-48" />
        </div>
        {/* List rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
