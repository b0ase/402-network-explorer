export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-zinc-900 animate-pulse ${className}`}
    />
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-zinc-950 p-4 md:p-6">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-7 w-32" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-zinc-800/50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
