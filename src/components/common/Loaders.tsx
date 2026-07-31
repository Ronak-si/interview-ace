import { Skeleton } from "@/components/ui/skeleton";

/** Loading skeleton for the KPI row. */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[118px] rounded-2xl" />
      ))}
    </div>
  );
}

/** Loading skeleton for list/table sections. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

/** Full-page centered loading state (route guards, lazy chunks). */
export function FullPageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="mesh-bg flex min-h-screen flex-col items-center justify-center gap-4">
      <span className="border-primary/25 border-t-primary size-9 animate-spin rounded-full border-3" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
