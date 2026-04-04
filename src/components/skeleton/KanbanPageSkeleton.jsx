import { Skeleton } from "@/components/ui/skeleton";

function KanbanCardSkeleton() {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-start gap-2">
        <Skeleton className="h-6 w-6 rounded-md shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex justify-between gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-14 rounded-md" />
          </div>
          <Skeleton className="h-3 w-full max-w-[180px] rounded-md" />
          <div className="flex justify-between items-center pt-1">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnSkeleton({ count }) {
  return (
    <div className="flex flex-col min-w-[260px] sm:min-w-[280px] md:min-w-0 snap-center">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 px-1">
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-5 w-8 rounded-full ml-auto" />
      </div>
      <div className="flex-1 space-y-2 sm:space-y-3 rounded-xl p-2 min-h-[120px]">
        {Array.from({ length: count }).map((_, i) => (
          <KanbanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function KanbanPageSkeleton() {
  return (
    <div className="animate-fade-in" aria-busy="true" aria-label="Loading board">
      <div className="md:hidden space-y-3">
        <div className="flex gap-1 p-1 rounded-xl bg-surface-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-10 rounded-lg" />
          ))}
        </div>
        <div className="space-y-2">
          <KanbanCardSkeleton />
          <KanbanCardSkeleton />
          <KanbanCardSkeleton />
        </div>
      </div>
      <div className="hidden md:block px-1 lg:px-2">
        <div className="grid grid-cols-3 gap-6 lg:gap-8 xl:gap-10 min-h-[600px]">
          <ColumnSkeleton count={3} />
          <ColumnSkeleton count={2} />
          <ColumnSkeleton count={2} />
        </div>
      </div>
    </div>
  );
}
