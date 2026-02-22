import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown while a public page (login / register) is streaming.
 * Mirrors the centred card layout used by `(public)/layout.tsx`.
 */
export default function PublicLoading() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Card header */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36 mx-auto" />
          <Skeleton className="h-4 w-52 mx-auto" />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
