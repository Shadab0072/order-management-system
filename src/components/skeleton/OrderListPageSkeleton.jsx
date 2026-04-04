import { Skeleton } from "@/components/ui/skeleton";

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <Skeleton className="h-4 w-24 rounded-md shrink-0" />
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Skeleton className="h-7 w-7 rounded-full shrink-0 hidden md:block" />
        <Skeleton className="h-4 flex-1 max-w-[160px] rounded-md" />
      </div>
      <Skeleton className="h-6 w-[4.5rem] rounded-lg shrink-0" />
      <Skeleton className="h-4 w-20 rounded-md shrink-0 text-right ml-auto" />
      <Skeleton className="h-4 w-24 rounded-md shrink-0 hidden md:block" />
      <div className="hidden sm:flex gap-1 shrink-0">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

function MobileCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 flex-1 rounded-md" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function OrderListPageSkeleton() {
  return (
    <div
      className="space-y-4 sm:space-y-6 animate-fade-in pb-10 sm:pb-12"
      aria-busy="true"
      aria-label="Loading orders">
      <div className="glass-card p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        <Skeleton className="h-9 w-full flex-1 rounded-xl min-w-0" />
        <Skeleton className="h-9 w-full sm:w-[10rem] rounded-xl" />
        <Skeleton className="h-9 w-full sm:w-[10rem] rounded-xl" />
        <Skeleton className="h-9 w-full sm:w-[8.5rem] rounded-xl" />
        <Skeleton className="h-9 w-full sm:w-[8.5rem] rounded-xl" />
        <Skeleton className="h-9 w-full sm:w-32 rounded-xl shrink-0" />
      </div>
      <div className="sm:hidden space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <MobileCardSkeleton key={i} />
        ))}
      </div>
      <div className="hidden sm:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[640px] p-4 sm:p-6">
            <div className="flex gap-6 border-b border-border pb-3 mb-0">
              {["Order", "Customer", "Status", "Amount", "Date", ""].map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-3 rounded-md ${i === 5 ? "w-20 ml-auto" : i === 3 ? "w-16 ml-auto" : "w-20"}`}
                />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="flex justify-center py-4 border-t border-border">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
